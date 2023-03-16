import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameData } from '../components/GameData'
import { PongService } from "../pong.service";

export const targetFPS = 60
export const targetResponseRate = 1000 / targetFPS

let queuedclient:[Socket, string] = [undefined, 'nope']
let n_game_rooms:number = 0
let game_name:string = 'game_0'
let connections:Map<Socket, [GameData, string[]]> = new Map<Socket,[GameData,string[]]>()
let gameList:string[][] = new Array<string[]>()
let customGameList:string[][] = new Array<string[]>()
let games:Map<string, [GameData, string[]]> = new Map<string, [GameData, string[]]>()
let p2Name:string
let p2UserID:string

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
		@MessageBody() data: {controls: string, userID:string, userName:string},
		@ConnectedSocket() client: Socket) {
			if (queuedclient[0] === undefined || client === queuedclient[0])
			{
				queuedclient[0] = client
				queuedclient[1] = data.controls
				p2Name = data.userName
				p2UserID = data.userID
				client.emit('pending')	
			}
			else
			{
				let gameInfo:string[] = new Array<string>
				let gameIDs:string[] = new Array<string>
				let dataIdTuple: [GameData, string[]]	
				//create room with queue'd clientid and client.id
				game_name = game_name.replace(n_game_rooms.toString(), (n_game_rooms+1).toString())
				n_game_rooms++
				client.emit('joined', data.controls)
				queuedclient[0].emit('joined', queuedclient[1])
				let client2 = queuedclient[0]
				queuedclient[0] = undefined

				//create gameData with default settings which holds all game info client needs to render
				let gamedata = new GameData(game_name, 100, 100)

				//add this game with the client IDs to a gamelist and insert <client, [data, IDs]> in a map which
				//can be used to access the right gamedata for movement events by clients, and based on ID order
				//update the correct Paddle (first ID = p1 = left paddle, second ID = p2 = right paddle, extra IDs are spectators)
				gameIDs.push(client.id)
				gameIDs.push(client2.id)
				gameIDs.push(data.userID)
				gameIDs.push(p2UserID)
				gameInfo.push(game_name)
				gameInfo.push(data.userName)
				gameInfo.push(p2Name)
				gameList.push(gameInfo)
				dataIdTuple = [gamedata, gameIDs]
				games.set(game_name, dataIdTuple)
				connections.set(client, dataIdTuple)
				connections.set(client2, dataIdTuple)
				gameIDs = []
				gameInfo = []
			}
		}

	@SubscribeMessage('createGame')
	handleCreateGame(
	@MessageBody() data: {userID:string, userName:string, customSettings:any},
	@ConnectedSocket() client: Socket) {
		let gamedata = new GameData('custom', data.customSettings.ballSpeed, data.customSettings.paddleSize)
		

	}

	//clients send movement events - using game map to fing the right game and its first or second
	//ID to update either p1 or p2 of the gamedata
	@SubscribeMessage('keyboard_movement')
	handleKeyboardInput(
		@MessageBody() direction: number,
		@ConnectedSocket() client: Socket) {
			let game = connections.get(client)
			if (game !== undefined)
			{
				if (game[1][0] === client.id)
					game[0].p1.update_kb(direction)
				if (game[1][1] === client.id)
					game[0].p2.update_kb(direction)
			}
	}

	@SubscribeMessage('mouse_movement')
	handleMouseMovement(
		@MessageBody() position: number,
		@ConnectedSocket() client: Socket) {
			
			let game = connections.get(client)
			if (game !== undefined)
			{
				if (game[1][0] === client.id)
					game[0].p1.update_mouse(position)
				if (game[1][1] === client.id)
					game[0].p2.update_mouse(position)
			}
	}


	@SubscribeMessage('spectate')
	handleSpectator(
		@MessageBody() gameName: string,
		@ConnectedSocket() client: Socket) {
			let dataIdTuple = games.get(gameName)
			// spectators.push(client.id)
			if (dataIdTuple !== undefined)
			{
				connections.set(client, dataIdTuple)
				client.emit('spectating')
			}
		}

	@SubscribeMessage('disconnect')
	handleDisconnect(
		@ConnectedSocket() client: Socket) {
			console.log('client:', client.id, ' disconnected')
			let game = connections.get(client)
			if (game !== undefined)
				connections.delete(client)
		}

	@SubscribeMessage('leave')
	handleLeaver(
		// @MessageBody() gameName: string,
		@ConnectedSocket() client: Socket) {
			let game = connections.get(client)
			if (game !== undefined)
				connections.delete(client)
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
			const string_array_in_tuple: string[] = connection[1][1]
			
			/* Send updated data */
			await_updates.push((async () =>
				this.server.to(client.id).emit('gamedata', gameData)
			)())
			
			/* Handle end of a game */
			var winningPlayer: string | null = null
			var losingPlayer: string | null = null
			switch (gameData.gameState) {
				case 'p1_won':
					winningPlayer = string_array_in_tuple[2]
					losingPlayer = string_array_in_tuple[3]
					break;
				case 'p2_won':
					winningPlayer = string_array_in_tuple[3]
					losingPlayer = string_array_in_tuple[2]
					break;
				default: continue;
			}
			
			/* Make game gets removed only once */
			if (games.get(gameData.gameName)) {
				games.delete(gameData.gameName)
				
				PongService.updateWinLoss(winningPlayer, losingPlayer);
				
				let index = gameList.indexOf([gameData.gameName, string_array_in_tuple[0], string_array_in_tuple[1]])
				if (index !== -1)
					gameList.splice(index, 1)
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
