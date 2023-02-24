import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { Paddle, Ball, GameData } from '../components/pong_objects'

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
				// let p1 = new Paddle(20,100,20,325,12)
				// let p2 = new Paddle(20,100,1460,325,12)
				// let ball = new Ball(20,20,740,365,7)
				// let p1_score = 0
				// let p2_score = 0
				// let gamenum = n_game_rooms
				// let gamedata_server = { p1, p2, ball, gamenum, p1_score, p2_score }
	
				//start sending data to clients
				setInterval(() => {
					// this.server.to(game_room).emit('gamedata', { 
					// 	gamedata
					// })
					this.server.to(client.id).emit('gamedata', { 
						gamedata,
						p1
					})
					this.server.to(client2.id).emit('gamedata', { 
						gamedata,
						p2
					})
					gamedata.ball.update()

					// this.server.on('gamedata_client', (socket, client_data) => {
					// 	if (socket.id === client.id)
					// 	{
					// 		if (client_data.pos === 1)
					// 		{
					// 			p1.up
					// 		}
					// 	}
					// 	else if (socket.id === client2.id)
					// 	{
					// 		//p2
					// 	}
					// })
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
	

// const io = new Server(4242)

// io.on("connection", (socket) => {
// 	socket.emit("hello", "world")

// 	socket.on("newMessage", (args) => {
// 		// console.log(args)
// 	})
// })

