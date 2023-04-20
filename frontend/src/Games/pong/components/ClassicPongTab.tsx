import React from 'react'
import { Button } from '@mui/material'

export const ClassicPongTab = (props:any) => {
	const [classicGame, setClassicGame] = React.useState(false)
	const [pending, setPending] = React.useState(false)

	props.socket.on('pending', () => {
		setPending(true)
	})
	props.socket.on('stop_pending', () => {
		setPending(false)
	})

	const findGame = (controls:string) => {
		let userID = props.userID
		let userName = props.userName
		props.socket.emit('LFG', {controls, userID, userName})
		setClassicGame(!classicGame)
	}
	const stopFindGame = () => {
		props.socket.emit('stop_LFG')
		setClassicGame(false)
	}

	const isClassicGame = () => {
		setClassicGame(!classicGame)
	}

	return (
		<div>
			<p></p>
			<Button variant="outlined" onClick={() => isClassicGame()}>Find Classic Game</Button>
			<div>
				{pending ?
					<div>
						<>Waiting for other player... </>
						<Button variant="contained" onClick={() => stopFindGame()}>Stop searching</Button>
					</div> 
				: classicGame ?
					<div>
						<p></p>
						Choose controls to join queue
						<p></p>
						<Button variant="contained" onClick={() => findGame('mouse')}>Mouse</Button>
						<Button variant="contained" onClick={() => findGame('keyboard')}>Keyboard</Button>
					</div>
				: <></>
				}
			</div>
		</div>
	)
}
