import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'


// const io = new Server(4242)

// io.on("connection", (socket) => {
// 	socket.emit("hello", "world")

// 	socket.on("newMessage", (args) => {
// 		// console.log(args)
// 	})
// })

let queuedclient:Socket = undefined
let n_game_rooms:number = 0
let game_room:string = 'game_0'

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
		this.server.on('disconnect', (socket) => {
			console.log(socket.id)
			console.log('disconnected')
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
				this.server.to("game1").emit("onMessage", { 
					msg: 'sending this to game1',
					content: 'this'
				})
				queuedclient = undefined
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
	

}
