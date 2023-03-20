import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameData } from '../components/GameData'
import { PongService } from "../pong.service";
import  DefaultConfig from "../components/Config"

export const targetFPS = 60
export const targetResponseRate = 1000 / targetFPS


const IDs = {
	p1_socket_id: 0,
	p2_socket_id: 1,
	p1_userID: 2,
	p2_userID: 3
}

let player2:Socket = undefined
let n_games:number = 0
let game_name:string = 'game_0'
let connections:Map<Socket, [GameData, string[]]> = new Map<Socket,[GameData,string[]]>()
let customGames:Map<string, [GameData, string[]]> = new Map<string, [GameData, string[]]>()
let games:Map<string, [GameData, string[]]> = new Map<string, [GameData, string[]]>()
let Config = DefaultConfig

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:4243']
	}
})

export class MyGateway implements OnModuleInit {
	
	public constructor() {
		this._runGameLoop(1)
	}
	
	@WebSocketServer()
	server:Server

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id, ' connected (websocket server)')
		})
	}

	@SubscribeMessage('LFG')
	handleLFG(
		@MessageBody() playerInfo: {controls: string, userID:string, userName:string},
		@ConnectedSocket() player: Socket) {
			if (player2 === undefined || player === player2)
			{
				player2 = player
				Config.p2_controls = playerInfo.controls
				Config.p2_name = playerInfo.userName
				Config.p2_userID = playerInfo.userID
				player.emit('pending')	
			}
			else
			{
				game_name = game_name.replace(n_games.toString(), (n_games+1).toString())
				n_games++
				Config.gameName = game_name
				Config.p1_name = playerInfo.userName
				Config.p1_controls = playerInfo.controls
				Config.p1_userID = playerInfo.userID
				player.emit('joined', Config.p1_controls)
				player2.emit('joined', Config.p2_controls)

				//create gameData with default settings which holds all game info client needs to render
				let gamedata = new GameData(Config)

				//add this game with the client IDs to a gamelist and insert <client, [data, IDs]> in a map which
				//can be used to access the right gamedata for movement events by clients, and based on ID order
				//update the correct Paddle (first ID = p1 = left paddle, second ID = p2 = right paddle, extra IDs are spectators)
				let gameInfo:string[] = new Array<string>
				let gameIDs:string[] = new Array<string>
				let dataIdTuple: [GameData, string[]]	
				
				gameIDs.push(player.id)
				gameIDs.push(player2.id)
				gameIDs.push(Config.p1_userID)
				gameIDs.push(Config.p2_userID)
				dataIdTuple = [gamedata, gameIDs]
				games.set(game_name, dataIdTuple)
				connections.set(player, dataIdTuple)
				connections.set(player2, dataIdTuple)
				player2 = undefined
				gameIDs = []
				gameInfo = []

				const serializedMap = [...games.entries()];
				this.server.emit('gamelist', serializedMap)
			}
		}

	@SubscribeMessage('createGame')
	handleCreateGame(
	@MessageBody() gameInfo: {userID:string, userName:string, customSettings:any},
	@ConnectedSocket() player: Socket) {
		if (player2 === player)
			player2 === undefined
		let CustomConfig = DefaultConfig
		CustomConfig.p1_controls = gameInfo.customSettings.controls
		CustomConfig.p2_controls = gameInfo.customSettings.controls
		CustomConfig.p1_name = gameInfo.userName
		CustomConfig.p1_userID = gameInfo.userID
		CustomConfig.ballSpeed = gameInfo.customSettings.ballSpeed
		CustomConfig.paddleSize = gameInfo.customSettings.paddleSize
		let gamedata = new GameData(CustomConfig)
		let gameIDs:string[] = new Array<string>
		gameIDs.push(player.id)
		customGames.set(gameInfo.customSettings.gameName, [gamedata, gameIDs])
		const serializedMap = [...customGames.entries()];
		this.server.emit('custom_gamelist', serializedMap)
		player.emit('game_created', gamedata)
	}


	// @SubscribeMessage('joinCustomGame')
	// handleJoin(
	// @MessageBody() playerInfo: {userID:string, userName:string, customSettings:any},
	// @ConnectedSocket() player: Socket) {
	// 	if (player2 === player)
	// 		player2 === undefined
	// 	let CustomConfig = DefaultConfig
	// 	CustomConfig.p1_controls = gameInfo.customSettings.controls
	// 	CustomConfig.p2_controls = gameInfo.customSettings.controls
	// 	CustomConfig.p1_name = gameInfo.userName
	// 	CustomConfig.p1_userID = gameInfo.userID
	// 	CustomConfig.BallSpeed = gameInfo.customSettings.BallSpeed
	// 	CustomConfig.paddleSize = gameInfo.customSettings.paddleSize
	// 	let gamedata = new GameData(CustomConfig)
	// 	customGames.push(gamedata)
	// 	player.emit('game_created', gamedata)
	// 	this.server.emit('custom_gamelist', customGames)
	// }


	//clients send movement events - using game map to fing the right game and its first or second
	//ID to update either p1 or p2 of the gamedata
	@SubscribeMessage('keyboard_movement')
	handleKeyboardInput(
		@MessageBody() direction: number,
		@ConnectedSocket() client: Socket) {
			const connection = connections.get(client)
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
			const connection = connections.get(client)
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
				connections.set(client, game)
				client.emit('spectating')
			}
		}

	//switching to pong window automatically tries to reconnect to any ongoing games
	@SubscribeMessage('reconnect')
	handleReconnect(
		@ConnectedSocket() client: Socket) {
			for (var game of games) {
				const clients = game[1][1]
				if (client.id === clients[0])
				{
					connections.set(client, game[1])
					client.emit('joined', game[1][0].p1_controls)
					break; 
				}
				if (client.id === clients[1])
				{
					connections.set(client, game[1])
					client.emit('joined', game[1][0].p2_controls)
					break;
				}
			}
		}
	
	@SubscribeMessage('refreshGameList')
	handleRefresh(
		@ConnectedSocket() client: Socket) {
			const serializedMap = [...games.entries()];
			this.server.emit('gamelist', serializedMap)
		}

	@SubscribeMessage('disconnect')
	handleDisconnect(
		@ConnectedSocket() client: Socket) {
			console.log('client:', client.id, ' disconnected')
			let connection = connections.get(client)
			if (connection !== undefined)
				connections.delete(client)
		}

	//remove client from connections on leave. Also unset the ID in the games map so it cant
	//reconnect automatically when switching from-to pong window
	@SubscribeMessage('leave')
	handleLeaver(
		@MessageBody() gameName: string,
		@ConnectedSocket() client: Socket) {
			let connection = connections.get(client)
			if (connection !== undefined)
			{
				connections.delete(client)
				let game = games.get(gameName)
				if (game !== undefined)
				{
					if (client.id === game[1][0])
						game[1][0] = ''
					else if (client.id === game[1][1])
						game[1][1] = ''
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
			
			const gamaData: GameData = game[1][0]

			/* Make sure games don't get updated twice */
			const gameName: string = gamaData.gameName
			if (!updated_games[gameName]) {
				updated_games[gameName] = true
				
				/* Update game asyncronosly and add to await array */
				await_updates.push((async () => 
					gamaData.update(deltaTime)
				)())
			}
		}
		
		/* Await all game updates */
		await Promise.all(await_updates)
		await_updates = [] // Clearing for new
		
		/* Send updated data */
		for (const connection of connections) {
			const client: Socket = connection[0]
			const gameData: GameData = connection[1][0]
			const gameIDs: string[] = connection[1][1]
			
			/* Send updated data */
			await_updates.push((async () =>
				this.server.to(client.id).emit('gamedata', gameData)
			)())
			
			/* Handle end of a game */
			var winningPlayer: string | null = null
			var losingPlayer: string | null = null
			switch (gameData.gameState) {
				case 'p1_won':
					winningPlayer = gameIDs[IDs.p1_userID]
					losingPlayer = gameIDs[IDs.p2_userID]
					break;
				case 'p2_won':
					winningPlayer = gameIDs[IDs.p2_userID]
					losingPlayer = gameIDs[IDs.p1_userID]
					break;
				default: continue;
			}

			/* Make game gets removed only once */
			if (games.get(gameData.gameName)) {
				games.delete(gameData.gameName)
				PongService.updateWinLoss(winningPlayer, losingPlayer);
				const serializedMap = [...games.entries()];
				this.server.emit('gamelist', serializedMap)
			}
			connections.delete(client)
		}
		
		/* Simulate Lag */
		// await_updates.push(new Promise(res => setTimeout(res, Math.random() * 100)))
		// await_updates.push(new Promise(res => setTimeout(res, 100)))
		
		/* Await all sends */
		await Promise.all(await_updates)
		
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
			setTimeout(() => this._startGameLoop(.02), Math.max(0, targetResponseRate - delta))
		/* Use delta time to make games playable under heavy or irregular load */
		else
			this._startGameLoop(Math.min(delta / 1000, .10))
	}
}
