import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameData } from '../components/GameData'
import { PongService } from "../pong.service";

const targetFPS = 60
const targetResponseRate = 1000 / targetFPS

let queuedclient:[Socket, string] = [undefined, 'nope']
let n_game_rooms:number = 0
let game_name:string = 'game_0'
let games:Map<Socket, [GameData, string[]]> = new Map<Socket,[GameData,string[]]>()
let gameIDs:string[] = new Array<string>()
let dataIdTuple: [GameData, string[]]
let gameInfo:string[] = new Array<string>()
let gameList:string[][] = new Array<string[]>()
let customGameList:string[][] = new Array<string[]>()
let findTuple:Map<string, [GameData, string[]]> = new Map<string, [GameData, string[]]>()
let spectators:string[] = new Array<string>()
let updated_games:string[] = new Array<string>()
let p2Name:string
let p2UserID:string

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:4243']
	}
})

export class MyGateway implements OnModuleInit {
	
	public constructor() {
		this._runGameLoop()
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
				let gamedata = new GameData('classic ' + game_name, 100, 100)

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
				findTuple.set(game_name, dataIdTuple)
				games.set(client, dataIdTuple)
				games.set(client2, dataIdTuple)
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
			let game = games.get(client)
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
			
			let game = games.get(client)
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
			let dataIdTuple = findTuple.get(gameName)
			// spectators.push(client.id)
			if (dataIdTuple !== undefined)
			{
				games.set(client, dataIdTuple)
				client.emit('spectating')
			}
		}

	@SubscribeMessage('disconnect')
	handleDisconnect(
		@ConnectedSocket() client: Socket) {
			console.log('client:', client.id, ' disconnected')
			let game = games.get(client)
			if (game !== undefined)
				games.delete(client)
		}

	@SubscribeMessage('leave')
	handleLeaver(
		// @MessageBody() gameName: string,
		@ConnectedSocket() client: Socket) {
			let game = games.get(client)
			if (game !== undefined)
				games.delete(client)
			this.server.to(client.id).emit('left')
		}
	
	private _startGameLoop = () => this._runGameLoop()
	
	private async _runGameLoop() {
		
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
					gamaData.update(gamaData.ball.update(gamaData.p1, gamaData.p2))
				)())
			}
		}
		
		/* Await all game updates */
		await Promise.all(await_updates)
		await_updates = [] // Clearing for new
		
		/* Send updated data */
		for (const game of games) {
			const client: Socket = game[0]
			const gameData: GameData = game[1][0]
			const string_array_in_tuple: string[] = game[1][1]
			
			/* Send updated data */
			await_updates.push((async () =>
				this.server.to(client.id).emit('gamedata', gameData)
			)())
			
			const updated_games = {} // Make sure games don't get updated twice
			
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
			
			/* Make sure wins/losses don't get updated twice */
			if (!updated_games[gameData.gameName]) {
				updated_games[gameData.gameName] = true
				PongService.updateWinLoss(winningPlayer, losingPlayer);
			}
			
			games.delete(client)
			let index = gameList.indexOf([gameData.gameName, string_array_in_tuple[0], string_array_in_tuple[1]])
			if (index !== -1)
				gameList.splice(index, 1)
		}
		
		/* Await all sends */
		await Promise.all(await_updates)
		
		/* Make sure games update in set intervals */
		const endTime = Date.now()
		const delta = endTime - startTime
		// if (delta > 1)
		// 	console.log(delta)
		setTimeout(this._startGameLoop, Math.max(0, targetResponseRate - delta))
	}
}
