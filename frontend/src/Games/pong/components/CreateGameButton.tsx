import { Button, Box, Slider, Typography } from '@mui/material'
import React from 'react'

export const CreateGameButton = (props:any) => {
	const [customGame, setCustomGame] = React.useState(false)
	const [ballSpeed, setBallSpeed] = React.useState(100)
	const [paddleSize, setPaddleSize] = React.useState(100)
	const [controls, setControls] = React.useState('mouse')

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

	const createGame = (customSettings: any,) => {
		let userID = props.userID
		let userName = props.userName
		props.socket.emit('createGame', {userID, userName, customSettings})
	}
	const isCustomGame = () => {
		setCustomGame(!customGame)
	}
	const setMouse = () => {
		setControls('mouse')
	}
	const setKeyboard = () => {
		setControls('keyboard')
	}

	return (
		<div className='dropdown-menu'>
			<button onClick={() => isCustomGame()}>Create Unranked Custom Game</button>
			{customGame ? 
			<ul>
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
					<p>Controls: {controls} </p>
					<Button variant="outlined" onClick={() => setMouse()}>Mouse</Button>
					<Button variant="outlined" onClick={() => setKeyboard()}>Keyboard</Button>
				</li>
				<p></p>
				<li className='dropdownItem'><Button variant="contained" onClick={() => createGame({ballSpeed, paddleSize, controls})}>Create Game</Button></li>
			</ul> : <></> }
		</div>
	)
}



