import { Button } from '@mui/material'
import React from 'react'

export const JoinClassicButton = (props:any) => {
	const [classicGame, setClassicGame] = React.useState(false)

	const findGame = (controls:string) => {
		let userID = props.userID
		let userName = props.userName
		props.socket.emit('LFG', {controls, userID, userName})
		setClassicGame(!classicGame)
	}
	const isClassicGame = () => {
		setClassicGame(!classicGame)
	}

	return (
		<div>
			<Button variant="outlined" onClick={() => isClassicGame()}>Join Classic Game</Button>
			{classicGame ? 
				<div>
					<p></p>
					<Button variant="contained" onClick={() => findGame('mouse')}>Mouse</Button>
					<Button variant="contained" onClick={() => findGame('keyboard')}>Keyboard</Button>
				</div>: <></> }
		</div>
	)
}