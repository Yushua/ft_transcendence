import { OnModuleInit, HttpException, HttpStatus } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameData } from '../components/GameData'
import { PongService } from "../pong.service";
import  Config from "../components/Config"
import { AuthGuardEncryption } from "src/auth/auth.guard";
import OurSession from "src/session/OurSession";

export const targetFPS = 60
export const targetResponseRateS = 1 / targetFPS
export const targetResponseRateMS = 1000 / targetFPS

export const IDs = {
	p1_socket_id: 0,
	p1_userID: 1,
	p2_socket_id: 2,
	p2_userID: 3
}

let player2:Socket = undefined
let n_games:number = 0
let game_name:string = 'Classic: 0'
let connections:Map<string, [GameData, string[]]> = new Map<string,[GameData,string[]]>() /* key: socket_id -- value: [gamedata, IDs]*/
let customGames:Map<string, [GameData, string[]]> = new Map<string, [GameData, string[]]>() /* key: private ? gameID : gameName -- value: [gamedata, IDs]*/
let games:Map<string, [GameData, string[]]> = new Map<string, [GameData, string[]]>() /* key: gameName -- value: [gamedata, IDs]*/
let gameConfig = new Config()

@WebSocketGateway({
	cors: {
		origin: true
	}
})

export class MyGateway implements OnModuleInit {
	
	public constructor(private _guard: AuthGuardEncryption) {
		this._runGameLoop(1)

	}

	@WebSocketServer()
	server:Server

	onModuleInit() {
		this.server.on('connection', async (socket) => {
			const user = await this._guard.GetUser(socket.handshake.headers["authorization"])
			if (!user)
				socket.disconnect()
			OurSession.SocketConnecting(user, socket.id)
		})
	}

	@SubscribeMessage('LFG')
	handleLFG(
		@MessageBody() playerInfo: {controls: string, userID:string, userName:string},
		@ConnectedSocket() player: Socket) {
			//check if player has a game created - if so delete this, one can only play one at the time
			for (var game of customGames) {
				if (game[1][1][IDs.p1_userID] === playerInfo.userID)
				{
					customGames.delete(game[0])
					const serializedMap = [...customGames.entries()]
					this.server.emit('custom_gamelist', serializedMap)		
					break
				}
			}
			if (player2 === undefined || player === player2)
			{
				player2 = player
				gameConfig.p2_controls = playerInfo.controls
				gameConfig.p2_name = playerInfo.userName
				gameConfig.p2_userID = playerInfo.userID
				player.emit('pending')	
			}
			else
			{
				game_name = game_name.replace(n_games.toString(), (n_games+1).toString())
				n_games++
				gameConfig.gameName = game_name
				gameConfig.p1_name = playerInfo.userName
				gameConfig.p1_controls = playerInfo.controls
				gameConfig.p1_userID = playerInfo.userID
				player.emit('joined', gameConfig.p1_controls)
				player2.emit('joined', gameConfig.p2_controls)
				OurSession.GameJoining(player.id)
				OurSession.GameJoining(player2.id)
				
				//create gameData with default settings which holds all game info client needs to render
				let gamedata = new GameData(gameConfig, true)

				//add this game with the client IDs to a gamelist and insert <client, [data, IDs]> in a map which
				//can be used to access the right gamedata for movement events by clients, and based on ID order
				//update the correct Paddle (first ID = p1 = left paddle, second ID = p2 = right paddle, extra IDs are spectators)
				let dataIdTuple: [GameData, string[]]
				dataIdTuple = [gamedata, [player.id, gameConfig.p1_userID, player2.id, gameConfig.p2_userID]]
				games.set(gameConfig.gameName, dataIdTuple)
				connections.set(player.id, dataIdTuple)
				connections.set(player2.id, dataIdTuple)
				player2 = undefined

				const serializedMap = [...games.entries()]
				this.server.emit('gamelist', serializedMap)
			}
		}
	@SubscribeMessage('stop_LFG')
	handleStopLFG(
		@ConnectedSocket() player: Socket) {
			player.emit('stop_pending')
			player2 = undefined
		}

	@SubscribeMessage('createGame')
	handleCreateGame(
	@MessageBody() gameInfo: {type:string, gameID:string, userID:string, userName:string, customSettings:any},
	@ConnectedSocket() player: Socket) {
		if (player2 === player) /* if creator was trying to join a classic game he stops doing so */
		{
			player2.emit('stop_pending')
			player2 = undefined
		}
		//cant create 2 games
		for (var game of customGames) {
			if (game[1][1][IDs.p1_userID] === gameInfo.userID)
			{
				customGames.delete(game[0])
				const serializedMap = [...customGames.entries()]
				this.server.emit('custom_gamelist', serializedMap)		
				break
			}
		}
		/* check if game name is set */
		if (gameInfo.customSettings.gameName.length === 0)
		{
			player.emit('no_game_name')
			return
		}
		/* check if game name already exists */
		for (var game of customGames) {
			if (game[0] === gameInfo.customSettings.gameName)
			{
				player.emit('gamename taken')
				return
			}
		}
		/* create new game with custom config, add it to customgames so others can see and join it */
		let CustomConfig = new Config()
		CustomConfig.p1_controls = gameInfo.customSettings.controls
		CustomConfig.p2_controls = gameInfo.customSettings.controls
		CustomConfig.p1_name = gameInfo.userName
		CustomConfig.p1_userID = gameInfo.userID
		CustomConfig.ballSpeed = gameInfo.customSettings.ballSpeed
		CustomConfig.paddleSize = gameInfo.customSettings.paddleSize
		CustomConfig.gameName = gameInfo.customSettings.gameName
		CustomConfig.acceleration = gameInfo.customSettings.acceleration
		CustomConfig.maxScore = gameInfo.customSettings.maxScore
		let gameData = new GameData(CustomConfig, false)
		if (gameInfo.type === 'public')
		{
			customGames.set(CustomConfig.gameName, [gameData, [player.id, gameInfo.userID]])
			const serializedMap = [...customGames.entries()]
			this.server.emit('custom_gamelist', serializedMap)
		}
		else if (gameInfo.type === 'private')
		{
			gameData.gameName === undefined
			customGames.set(gameInfo.gameID, [gameData, [player.id, gameInfo.userID]])
		}
		player.emit('game_created', gameInfo.gameID)
	}

	@SubscribeMessage('joinCustomGame')
	handleJoin(
	@MessageBody() playerInfo: { gameName:string, gameID:string, userID:string, userName:string},
	@ConnectedSocket() player2: Socket) {
		let customGame:[GameData, string[]]
		let key = playerInfo.gameName
		if (!key)
			key = playerInfo.gameID /* private games have their ID as key, public ones a game name */
		customGame = customGames.get(key)

		/* game needs to exist and can't join the game you yourself created*/
		if (customGame && customGame[1][IDs.p1_socket_id] !== player2.id)
		{
			customGames.delete(key)
			const serializedMap = [...customGames.entries()];
			this.server.emit('custom_gamelist', serializedMap)
		
			let gameData = customGame[0]
			gameData.p2_name = playerInfo.userName
			let _IDs = customGame[1]
			let player1_id:string = _IDs[0]
			_IDs.push(player2.id)
			_IDs.push(playerInfo.userID)
			games.set(key, [gameData, _IDs])
			const serializedMap2 = [...games.entries()];
			this.server.emit('gamelist', serializedMap2)

			connections.set(player2.id, [gameData, _IDs])
			connections.set(player1_id, [gameData, _IDs])
			player2.emit('joined', gameData.p1_controls)
			this.server.to(player1_id).emit('joined', gameData.p2_controls)

			OurSession.GameJoining(player1_id)
			OurSession.GameJoining(player2.id)
		}
	}

	@SubscribeMessage('refresh')
	async handleRefresh(
		@ConnectedSocket() client:Socket) {
		//check if in game
		const user = await this._guard.GetUser(client.handshake.headers["authorization"])
		const state = OurSession.GetUserState(user.id)
		
		for (var game of games) {
			var _IDs = game[1][1]
			if (user.id === _IDs[IDs.p1_userID]) { //if user left game we dont let him re-join
				if (_IDs[IDs.p1_socket_id] === 'left') {
					break
				}
				else if (_IDs[IDs.p1_socket_id] === 'disconnected') { //if user disconnected from game he joins with new socket id
					_IDs[IDs.p1_socket_id] = client.id
					connections.set(client.id, game[1])
					OurSession.GameJoining(client.id)
					client.emit('joined', game[1][0].p1_controls)
				}
				else if (_IDs[IDs.p1_socket_id] === client.id) { //if user just switched tabs he just switches back to the canvas
					client.emit('joined', game[1][0].p1_controls)
				}
			}
			if (user.id === _IDs[IDs.p2_userID]) {
				if (_IDs[IDs.p2_socket_id] === 'left') {
					break
				}
				else if (_IDs[IDs.p2_socket_id] === 'disconnected') {
					_IDs[IDs.p2_socket_id] = client.id
					connections.set(client.id, game[1])
					OurSession.GameJoining(client.id)
					client.emit('joined', game[1][0].p2_controls)
				}
				else if (_IDs[IDs.p2_socket_id] === client.id) {
					client.emit('joined', game[1][0].p2_controls)
				}
			}
		}
		const serializedMap = [...customGames.entries()]
		const serializedMap2 = [...games.entries()]
		client.emit('custom_gamelist', serializedMap)
		client.emit('gamelist', serializedMap2)
	}

	//clients send movement events - using game map to fing the right game and its first or second
	//ID to update either p1 or p2 of the gamedata
	@SubscribeMessage('keyboard_movement')
	handleKeyboardInput(
		@MessageBody() direction: number,
		@ConnectedSocket() client: Socket) {
			const connection = connections.get(client.id)
			if (connection !== undefined)
			{
				const gamedata = connection[0]
				const gameIDs = connection[1]	
				if (gameIDs[IDs.p1_socket_id] === client.id)
					gamedata.p1.update_kb(direction)
				if (gameIDs[IDs.p2_socket_id] === client.id)
					gamedata.p2.update_kb(direction)
			}
	}

	@SubscribeMessage('mouse_movement')
	handleMouseMovement(
		@MessageBody() position: number,
		@ConnectedSocket() client: Socket) {
			const connection = connections.get(client.id)
			if (connection !== undefined)
			{
				const gamedata = connection[0]
				const gameIDs = connection[1]	
				if (gameIDs[IDs.p1_socket_id] === client.id)
					gamedata.p1.update_mouse(position)
				if (gameIDs[IDs.p2_socket_id] === client.id)
					gamedata.p2.update_mouse(position)
			}
		}

	@SubscribeMessage('spectate')
	handleSpectator(
		@MessageBody() gameName: string,
		@ConnectedSocket() client: Socket) {
			let game = games.get(gameName)
			if (game !== undefined)
			{
				connections.set(client.id, game)
				client.emit('spectating')
			}
		}
		
	@SubscribeMessage('disconnect')
	async handleDisconnect(
		@ConnectedSocket() client: Socket) {
			if (client === player2)
				player2 = undefined
			let connection = connections.get(client.id)
			if (connection !== undefined)
				connections.delete(client.id)
			const user = await this._guard.GetUser(client.handshake.headers["authorization"])
			if (user) {
				const state = OurSession.GetUserState(user.id)
				if (state === 'inGame')
					OurSession.GameLeaving(client.id)
				OurSession.SocketDisconnecting(client.id)
				for (var game of games) {
					if (game[1][1].includes(client.id)) {
						if (game[1][1][IDs.p1_socket_id] == client.id)
							game[1][1][IDs.p1_socket_id] = 'disconnected'
						if (game[1][1][IDs.p2_socket_id] == client.id)
							game[1][1][IDs.p2_socket_id] = 'disconnected'
					}
				}
				for (var game of customGames) {
					if (game[1][1][IDs.p1_userID] === user.id)
					{
						customGames.delete(game[0])
						const serializedMap = [...customGames.entries()]
						this.server.emit('custom_gamelist', serializedMap)		
						break
					}
				}
			}
		}

	@SubscribeMessage('deleteCreatedGame')
	handleDelete(
		@ConnectedSocket() creator: Socket) {
			for (const game of customGames) {
				if (game[1][1][0] === creator.id) {
					customGames.delete(game[0])
					const serializedMap = [...customGames.entries()]
					this.server.emit('custom_gamelist', serializedMap)
				}
			}
		}

	//remove client from connections on leave
	@SubscribeMessage('leave')
	handleLeaver(
		@ConnectedSocket() client: Socket) {
			let connection = connections.get(client.id)
			if (connection !== undefined) {
				connections.delete(client.id)
				if (connection[1].includes(client.id))
					OurSession.GameLeaving(client.id)
			}
			for (var game of games) {
				if (game[1][1].includes(client.id)) {
					if (game[1][1][IDs.p1_socket_id] == client.id)
						game[1][1][IDs.p1_socket_id] = 'left'
					if (game[1][1][IDs.p2_socket_id] == client.id)
						game[1][1][IDs.p2_socket_id] = 'left'
				}
			}
			this.server.to(client.id).emit('left')
		}
	
	private _startGameLoop = (deltaTime: number) => this._runGameLoop(deltaTime)
	
	private async _runGameLoop(deltaTime: number) {
		
		const startTime = Date.now()
		
		const updated_games = {} // Make sure games don't get updated twice
		var await_updates = [] // Array of update promises
		
		/* Update all Games */
		for (var game of games) {
			
			const gameData:GameData = game[1][0]
			const gameIDs:string[] = game[1][1]

			/* Make sure games don't get updated twice */
			const gameName: string = game[0]
			if (!updated_games[gameName]) {
				updated_games[gameName] = true
				
				/* Update game asyncronosly and add to await array */
				gameData.update(deltaTime)
				// await_updates.push((async () => 
					
				// )())
			}
			/* Handle end of game */
			// console.log(gameData.gameState)
			switch (gameData.gameState) {
				case 'p1_won':
				case 'p2_won':
					await PongService.GetInstance()?.postPongStats(gameIDs, gameData)
					break;
				default: continue;
			}
			games.delete(gameName)
			const serializedMap = [...games.entries()];
			this.server.emit('gamelist', serializedMap)
		}
		
		/* Await all game updates */
		await Promise.all(await_updates)
		await_updates = [] // Clearing for new
		
		/* Send updated data */
		for (const connection of connections) {
			const clientID: string = connection[0]
			const gameData: GameData = connection[1][0]

			/* Send updated data */
			await_updates.push((async () =>
				this.server.to(clientID).emit('gamedata', gameData)
			)())
			
			/* Handle end of a game */
			if (gameData.gameState === 'p1_won' || gameData.gameState === 'p2_won' ) {
				connections.delete(clientID)
				if (connection[1][1].includes(clientID))
					OurSession.GameLeaving(clientID)
			}
		}
		
		/* Simulate Lag */
		// await_updates.push(new Promise(res => setTimeout(res, Math.random() * 100)))
		// await_updates.push(new Promise(res => setTimeout(res, 100)))
		
		/* Await all sends */
		// await Promise.all(await_updates)
		
		/* Make sure games update in set intervals */
		const endTime = Date.now()
		var delta = endTime - startTime
		
		/* Print Slowdown */
		// if (delta < 2) {}
		// else if (delta < 5) { console.log(`${"\x1b[37m"}${delta}${"\x1b[0m"}`) }
		// else if (delta < 10) { console.log(`${"\x1b[33m"}${delta}${"\x1b[0m"}`) }
		// else if (delta < 15) { console.log(`${"\x1b[43m"}${delta}${"\x1b[0m"}`) }
		// else if (delta < 20) { console.log(`${"\x1b[31m"}${delta}${"\x1b[0m"}`) }
		// else { console.log(`${"\x1b[41m"}${delta}${"\x1b[0m"}`) }
		
		/* Use fixed framerate to reserve resources */
		if (delta < 20)
			setTimeout(() => this._startGameLoop(targetResponseRateS), Math.max(0, targetResponseRateMS - delta))
		/* Use delta time to make games playable under heavy or irregular load */
		else
			this._startGameLoop(Math.min(delta / 1000, .10))
	}
}