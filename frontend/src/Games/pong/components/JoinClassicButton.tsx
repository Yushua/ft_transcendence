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
		<div className='dropdown-menu'>
			<Button variant="outlined" onClick={() => isClassicGame()}>Join Classic Game</Button>
			{classicGame ? 
			<ul>
				&nbsp;
				<li className='dropdownItem'><Button variant="contained" onClick={() => findGame('mouse')}>Mouse</Button></li>
				&nbsp;
				<li className='dropdownItem'><Button variant="contained" onClick={() => findGame('keyboard')}>Keyboard</Button></li>
			</ul> : <></> }
		</div>
	)
}