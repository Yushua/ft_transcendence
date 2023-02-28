import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { Ball, GameData, Paddle } from '../components/pong_objects'

let queuedclient:Socket = undefined
let n_game_rooms:number = 0
let game_room:string = 'game_0'
let p1 = 'p1'
let p2 = 'p2'

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
				client.emit('joined', game_room)
				queuedclient.emit('joined', game_room)
				let client2 = queuedclient
				queuedclient = undefined

				//create new paddles and ball
				let gamedata = new GameData
				let p1 = new Paddle(7, 1, 1500, 750, 20, 20, 100)
				let p2 = new Paddle(7, 2, 1500, 750, 20, 20, 100)
				let ball = new Ball(12, 3, 1500, 750, 20, 20, 20)
	
				//update player pos
				this.server.on('gamedata_client', (socket, client_data) => {
					if (socket.id === client.id)
					{
						if (client_data.pos === 1)
							p1.update()
						else if (socket.id === client2.id)
							p2.update()
					}
				})

				//start sending data to clients
				setInterval(() => {
					this.server.to(client.id).emit('gamedata', gamedata, p1, p2, ball)
					this.server.to(client2.id).emit('gamedata', gamedata, p1, p2, ball)
					gamedata.update(ball.update(p1, p2))
				})
			}
		}
}

// @SubscribeMessage('newMessage')
// onNewMessage(@MessageBody() body:any) {
// 	console.log(body)
// 	this.server.emit('onMessage', {
// 		msg: 'return message:',
// 		content: body
// 	})
// }

// @SubscribeMessage('events')
// handleEvent(
// 	@MessageBody('id') id: number,
// 	@ConnectedSocket() client: Socket) : number {
// 		return id;
// 	}