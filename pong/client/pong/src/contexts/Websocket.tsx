import React, { MutableRefObject } from "react"
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
	// let pending:MutableRefObject<boolean> = React.useRef(false)
	const [pending, setPending] = React.useState(false)
	const [connected, setConnected] = React.useState(false)

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
			<h5>{pending ? 'Waiting for second player...' : 'Click to join game'}</h5>
			<button onClick={() => findGame()}>Join Game</button>
		</div>
	)
}
