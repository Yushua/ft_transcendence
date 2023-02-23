import React from "react"
import { RenderPong } from "../components/Pong"
import { WebsocketContext } from "./WebsocketContext"


type MessagePayload = {
	content:string
	msg:string
}

export const Websocket = () => {

	const socket = React.useContext(WebsocketContext)
	// const [gamename, setGameName] = React.useState("")
	/*todo */
	// const [game_data, setGameData] = React.useState<MessagePayload[]>([])
	const [pending, setPending] = React.useState(false)
	const [connected, setConnected] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)

	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('connected with gateway!', socket.id)
			setConnected(true)
		})
		socket.on('onMessage', (newMessage: MessagePayload) => {
			console.log(newMessage.msg)
			console.log(newMessage.content)
			// setGameData((prev) => [...prev, newMessage])
		})
		socket.on('pending', () => {
			setPending(true)
		})
		socket.on('joined', (gamename: string) => {
			console.log(gamename)
			setInGame(true)
			setPending(false)
		})
		return () => {
			console.log('unregisterin events')
			socket.off('connect')
			socket.off('onMessage')

		}
	}, [socket])

	const findGame = () => {
		socket.emit('LFG')
	}
	
	return (
		<div>
			 {pending ? `Waiting for second player...` : inGame ? <RenderPong /> : <button onClick={() => findGame()}>Join Game</button>}
		</div>
	)
}
