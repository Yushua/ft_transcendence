import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameData } from '../components/pong_objects'

let queuedclient:Socket = undefined
let n_game_rooms:number = 0
let game_room:string = 'game_0'
let gamedata:GameData
let player1:Socket
let player2:Socket

let gamedata_array:Array<GameData>

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
				game_room = game_room.replace(n_game_rooms.toString(), (n_game_rooms+1).toString())
				n_game_rooms++
				console.log(game_room)
				client.join(game_room)
				queuedclient.join(game_room)
				client.emit('joined', n_game_rooms)
				queuedclient.emit('joined', n_game_rooms)
				let client2 = queuedclient
				queuedclient = undefined
				player1 = client
				player2 = client2

				//create new paddles and ball
				gamedata = new GameData(n_game_rooms)
					// gamedata_array.push(gamedata)

				//start sending data to clients
				setInterval(() => {
					this.server.to(client.id).emit('gamedata', gamedata, /*p1, p2, ball*/)
					this.server.to(client2.id).emit('gamedata', gamedata, /*p1, p2, ball*/)
					gamedata.update(gamedata.ball.update(gamedata.p1, gamedata.p2))

				}, 10)
			}
		}
		@SubscribeMessage('movement')
		handleEvent(
			@MessageBody() body: number,
			@ConnectedSocket() client: Socket) {
				console.log('from:', client.id)
				console.log('msg:', body)
				if (client.id === player1.id)
					gamedata.p1.update(body)
				if (client.id === player2.id)
					gamedata.p2.update(body)
			}
}