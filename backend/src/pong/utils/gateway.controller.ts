import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameData } from '../components/GameData'
import { PongService } from "../pong.service";


let queuedclient:[Socket, string] = [undefined, 'nope']
let n_game_rooms:number = 0
let game_name:string = 'game_0'
let gamedata:GameData
let games:Map<Socket, [GameData, string[]]> = new Map<Socket,[GameData,string[]]>
let roomIDs:string[] = new Array<string>
let dataIdTuple: [GameData, string[]]
let gameInfo:string[] = new Array<string>
let gameList:string[][] = new Array<string[]>
let findTuple:Map<string, typeof dataIdTuple> = new Map<string, typeof dataIdTuple>
let spectators:string[] = new Array<string>
let updated_games:string[] = new Array<string>
let p2Name:string

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:4243']
	}
})

export class MyGateway implements OnModuleInit {

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
				client.emit('pending')	
			}
			else
			{
				//create room with queue'd clientid and client.id
				game_name = game_name.replace(n_game_rooms.toString(), (n_game_rooms+1).toString())
				n_game_rooms++
				client.emit('joined', data.controls)
				queuedclient[0].emit('joined', queuedclient[1])
				let client2 = queuedclient[0]
				queuedclient[0] = undefined

				//create gameData which holds all game info client needs to render
				gamedata = new GameData(n_game_rooms, game_name, client.id, client2.id)

				//add this game with the client IDs to a gamelist and insert <client, [data, IDs]> in a map which
				//can be used to access the right gamedata for movement events by clients, and based on ID order
				//update the correct Paddle (first ID = p1 = left paddle, second ID = p2 = right paddle, extra IDs are spectators)
				roomIDs.push(client.id)
				roomIDs.push(client2.id)
				gameInfo.push(game_name)
				gameInfo.push(data.userName)
				gameInfo.push(p2Name)
				gameList.push(gameInfo)
				dataIdTuple = [gamedata, roomIDs]
				findTuple.set(game_name, dataIdTuple)
				games.set(client, dataIdTuple)
				games.set(client2, dataIdTuple)
				roomIDs = []
				gameInfo = []
			}
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
			dataIdTuple = findTuple.get(gameName)
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

	//send data to clients
	private emit_interval = setInterval(() => {
		//send game data to all clients currently in a game
		games.forEach((data_id_tuple: [GameData, string[]], Client: Socket) => {
		this.server.to(Client.id).emit('gamedata', data_id_tuple[0])
		if (data_id_tuple[0].gameState === 'p1_won' || data_id_tuple[0].gameState === 'p2_won')
		{
			//update database with win/loss for users
			if (data_id_tuple[0].gameState === 'p1_won')
				PongService.updateWinLoss(data_id_tuple[1][0], data_id_tuple[1][1])
			else
				PongService.updateWinLoss(data_id_tuple[1][1], data_id_tuple[1][0])
			//delete clients from active game list and from games map to stop sending data
			games.delete(Client)
			let index = gameList.indexOf([data_id_tuple[0].gameName, data_id_tuple[1][0], data_id_tuple[1][1]])
			gameList.splice(index, 1)
		}
		//send gamelist to all clients
		this.server.emit('gamelist', gameList)
		})
	}, 10)

	//update gamedata - only once per game (games forEach loops over all clients)
	private update_interval = setInterval(() => {
		updated_games = []
		games.forEach((data_id_tuple: [GameData, string[]], Client: Socket) => {

			let index = updated_games.indexOf(data_id_tuple[0].gameName)
			if (index === -1)
			{
				data_id_tuple[0].update(data_id_tuple[0].ball.update(data_id_tuple[0].p1, data_id_tuple[0].p2))
				updated_games.push(data_id_tuple[0].gameName)
			}
		})
	}, 10)
}
