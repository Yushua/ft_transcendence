import React from "react"
import { WebsocketContext } from "./WebsocketContext"

type MessagePayload = {
	content:string
	msg:string
}

export const Websocket = () => {

	const socket = React.useContext(WebsocketContext)
	const [value, setValue] = React.useState("")

	/*todo */
	const [game_data, setGameData] = React.useState<MessagePayload[]>([])

	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('connected with gateway!', socket.id)
		})
		socket.on('onMessage', (newMessage: MessagePayload) => {
			console.log(newMessage.msg)
			console.log(newMessage.content)
			setGameData((prev) => [...prev, newMessage])
		})
		return () => {
			console.log('unregisterin events')
			socket.off('connect')
			socket.off('onMessage')

		}
	}, [socket])

	const onSubmit = () => {
		socket.emit('newMessage', value)
		setValue("")
	}

	return (
		<div>
			<div>
				<h1>
					Websocket Component
				</h1>
				<div>
					{game_data.length === 0 ?
						<div>
							No Data
						</div> :
						<div>
							{game_data.map((msg) => 
							<div>
								<p> {msg.content} </p>
							</div>)}
						</div>}
				</div>
				<div>
					<input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
					<button onClick={() => onSubmit()}>Submit</button>
				</div>
			</div>
		</div>
	)
}