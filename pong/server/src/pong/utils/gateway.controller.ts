import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameData } from '../components/pong_objects'

let queuedclient:Socket = undefined
let n_game_rooms:number = 0
let game_name:string = 'game_0'
let gamedata:GameData
let games:Map<Socket, [GameData, string[]]> = new Map<Socket,[GameData,string[]]>
let roomIDs:string[] = new Array<string>
let gameList:string[] = new Array<string>
let dataIdTuple: [GameData, string[]]

//MAKE A LisT OF ALL CURRENT GAMES
//EMIT AND LISTEN PROPERLY TO CLientS WHO ARE IN GAMES
//MAKE OPTION TO ENTER MORE CLIENTS TO A GAME
//THey RENDER ThE GAME BUT CANT UPDATE (spectators)
@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000']
	}
})

export class MyGateway implements OnModuleInit {

	@WebSocketServer()
	server:Server

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id)
			console.log('Connected')
		})
	}

	@SubscribeMessage('LFG')
	handleLFG(
		@ConnectedSocket() client: Socket) {
			console.log(client.id)
			if (queuedclient === undefined || client === queuedclient)
			{
				queuedclient = client
				client.emit('pending')
			}
			else
			{
				//create room with queue'd clientid and client.id
				game_name = game_name.replace(n_game_rooms.toString(), (n_game_rooms+1).toString())
				n_game_rooms++
				console.log(game_name)
				client.join(game_name)
				queuedclient.join(game_name)
				client.emit('joined', n_game_rooms)
				queuedclient.emit('joined', n_game_rooms)
				let client2 = queuedclient
				queuedclient = undefined

				//create gameData which holds all game info client needs to render
				gamedata = new GameData(n_game_rooms, game_name, client.id, client2.id)

				//add this game with the client IDs to a gamelist and insert <client, [data, IDs]> in a map which
				//can be used to access the right gamedata for movement events by clients, and based on ID order
				//update the correct Paddle (first ID = p1 = left paddle, second ID = p2 = right paddle, extra IDs are spectators)
				roomIDs.push(client.id)
				roomIDs.push(client2.id)
				gameList.push(game_name + ' ' + client.id)
				gameList.push(game_name + ' ' + client2.id)
				dataIdTuple = [gamedata, roomIDs]
				games.set(client, dataIdTuple)
				games.set(client2, dataIdTuple)
				roomIDs = []

			}
		}
		//clients send movement events - using game map to fing the right game and its first or second
		//ID to update either p1 or p2 of the gamedata
		@SubscribeMessage('movement')
		handleEvent(
			@MessageBody() direction: number,
			@ConnectedSocket() client: Socket) {
				let game = games.get(client)
				if (game !== undefined)
				{
					if (game[1][0] === client.id)
						game[0].p1.update(direction)
					if (game[1][1] === client.id)
						game[0].p2.update(direction)
				}
		}
		//send data to clients
		private interval = setInterval(() => {
		games.forEach((data_id_tuple: [GameData, string[]], Client: Socket) => {
			//send game data
			this.server.to(Client.id).emit('gamedata', data_id_tuple[0])
			if (data_id_tuple[0].gameState === 'p1_won' || data_id_tuple[0].gameState === 'p2_won')
				games.delete(Client)
			else
				data_id_tuple[0].update(data_id_tuple[0].ball.update(data_id_tuple[0].p1, data_id_tuple[0].p2))
			//send game_room info
			this.server.to(Client.id).emit('gamelist', gameList)
			})
		}, 10)
}