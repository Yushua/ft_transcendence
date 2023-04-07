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
		<React.Fragment>
			<Button variant="outlined" onClick={() => _setShowMenu()}>Join Private Game</Button>
			{showMenu ? 
			<div>
				<p></p>
				&nbsp;&nbsp;
					<>Paste Code:</>
					&nbsp;
					<input
						type="text"
						id="message"
						name="message"
						onChange={handleTextChange} />
					&nbsp;&nbsp;
					<Button variant="contained" onClick={() => join(gameID, props.userID, props.userName, props.socket)}>Join</Button>
			</div> : <></> }
		</React.Fragment>
	)
}