import { Button } from '@mui/material'
import { useState, Fragment } from 'react'
import { Socket } from 'socket.io-client'

export const JoinPrivateButton = (props:any) => {
	const [showMenu, setShowMenu] = useState(false)
	const [gameID, setGameID] = useState('')

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
		<Fragment>
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
						autoComplete="off"
						onChange={handleTextChange} />
					&nbsp;&nbsp;
					<Button variant="contained" onClick={() => join(gameID, props.userID, props.userName, props.socket)}>Join</Button>
			</div> : <></> }
		</Fragment>
	)
}