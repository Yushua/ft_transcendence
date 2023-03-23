import { Button } from '@mui/material'
import React from 'react'
import { Socket } from 'socket.io-client'

export const JoinPrivateButton = (props:any) => {
	const [showMenu, setShowMenu] = React.useState(false)
	const [gameID, setGameID] = React.useState('')

	const join = (gameID:string, userID:string, userName:string, socket:Socket) =>
	{
		socket.emit('joinCustomGame', {gameID, userID, userName})
	}

	const _setShowMenu = () => {
		setShowMenu(!showMenu)
	}
	const handleTextChange = (event:any) => {
		setGameID(event.target.value);
	}

	return (
		<div className='dropdown-menu'>
			<Button variant="outlined" onClick={() => _setShowMenu()}>Join Private Game</Button>
			{showMenu ? 
			<ul>
				&nbsp;
				<li className='dropdownItem'>
					<>Paste Code:</>
					&nbsp;
					<input
						type="text"
						id="message"
						name="message"
						onChange={handleTextChange} />
					&nbsp;
					<Button variant="contained" onClick={() => join(gameID, props.userID, props.userName, props.socket)}>Join</Button>
				</li>
			</ul> : <></> }
		</div>
	)
}