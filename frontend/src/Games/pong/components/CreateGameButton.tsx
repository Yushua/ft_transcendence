import { Button, Box, Slider, Typography } from '@mui/material'
import React from 'react'

export const CreateGameButton = (props:any) => {
	const [customGame, setCustomGame] = React.useState(false)
	const [ballSpeed, setBallSpeed] = React.useState(100)
	const [paddleSize, setPaddleSize] = React.useState(100)
	const [controls, setControls] = React.useState('mouse')
	const [gameName, setGameName] = React.useState('gameName')
	const [isMouse, setIsMouse] = React.useState(true)

	const handleBallChange = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setBallSpeed(newValue);
		}
	}
	const handlePaddleChange = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setPaddleSize(newValue);
		}
	}

	const handleTextChange = (event:any) => {
		setGameName(event.target.value);
	}
			
	const createGame = (type:string, customSettings: any) => {
		let userID = props.userID
		let userName = props.userName
		props.socket.emit('createGame', {type, userID, userName, customSettings})
	}
	const isCustomGame = () => {
		setCustomGame(!customGame)
	}
	const setMouse = () => {
		setIsMouse(true)
		setControls('mouse')
	}
	const setKeyboard = () => {
		setIsMouse(false)
		setControls('keyboard')
	}

	return (
		<React.Fragment>
			<Button variant="outlined" onClick={() => isCustomGame()}>Create Custom Game</Button>
			{customGame ? 
			<ul>
				&nbsp;
				<li className='dropdownItem'>Choose Ball Speed</li>
					<Box sx={{ width: 250 }}>
						<Typography id="non-linear-slider" gutterBottom>
							{ballSpeed}%
						</Typography>
						<Slider
							value={ballSpeed}
							min={100}
							step={1}
							max={200}
							onChange={handleBallChange}
							valueLabelDisplay="auto"
							aria-labelledby="non-linear-slider"
						/>
					</Box>
				<li className='dropdownItem'>Choose Paddle Size</li>
					<Box sx={{ width: 250 }}>
						<Typography id="non-linear-slider" gutterBottom>
							{paddleSize}%
						</Typography>
						<Slider
							value={paddleSize}
							min={5}
							step={1}
							max={500}
							onChange={handlePaddleChange}
							valueLabelDisplay="auto"
							aria-labelledby="non-linear-slider"
						/>
					</Box>
				<li className='dropdownItem'>
					{isMouse ?
						<div>
							<Button variant="contained" onClick={() => setMouse()}>Mouse</Button>
							&nbsp;
							<Button variant="outlined" onClick={() => setKeyboard()}>Keyboard</Button> 
						</div> :
						<div>
							<Button variant="outlined" onClick={() => setMouse()}>Mouse</Button>
							&nbsp;
							<Button variant="contained" onClick={() => setKeyboard()}>Keyboard</Button>
						</div>}
				</li>
				&nbsp;
				<li className='dropdownItem'>
					<>Game Name:</>
					&nbsp;
					<input
						type="text"
						id="message"
						name="message"
						onChange={handleTextChange} />
				</li>
				&nbsp;
				<li>
					<Button variant="contained" onClick={() => createGame('public', {gameName, ballSpeed, paddleSize, controls})}>Create Public Game</Button>
					&nbsp;
					<Button variant="contained" onClick={() => createGame('private', {gameName, ballSpeed, paddleSize, controls})}>Create Private Game</Button>
				</li>
			</ul> : <></> }
		</React.Fragment>
	)
}



