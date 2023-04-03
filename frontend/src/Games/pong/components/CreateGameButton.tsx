import { Button, Box, Slider, Typography } from '@mui/material'
import React from 'react'

//add color options to paddle/map/ball mayb

function makeGameID() {
    let gameID = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 15) {
		gameID += characters.charAt(Math.floor(Math.random() * charactersLength));
    	counter += 1;
    }
    return gameID;
}


export const CreateGameButton = (props:any) => {
	const [customGame, setCustomGame] = React.useState(false)
	const [ballSpeed, setBallSpeed] = React.useState(100)
	const [acceleration, setBallAcceleration] = React.useState(0.5	)
	const [paddleSize, setPaddleSize] = React.useState(100)
	const [controls, setControls] = React.useState('mouse')
	const [gameName, setGameName] = React.useState('gameName')
	const [isMouse, setIsMouse] = React.useState(true)
	const [gameNameTaken, setGameNameTaken] = React.useState(false)

	props.socket.on('gamename taken', () => {
		console.log('allo')
		setGameNameTaken(true)
	})

	const handleBallChange = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setBallSpeed(newValue);
		}
	}
	const handleAccelerationChange = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setBallAcceleration(newValue);
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
		let gameID = undefined
		if (type === 'private') {
			gameID = makeGameID()
		}
		props.socket.emit('createGame', {type, gameID, userID, userName, customSettings})
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
			<div>
				<h4 style={{ color: "#3368FF"}}>Choose Ball Speed
					<Box sx={{ width: 250 }}>
						<Typography id="non-linear-slider" gutterBottom style={{ color: "#3368FF"}}>
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
				</h4>
				<h4 style={{ color: "#3368FF"}}>Choose Paddle Size
					<Box sx={{ width: 250 }}>
						<Typography id="non-linear-slider" gutterBottom style={{ color: "#3368FF"}}>
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
				</h4>
				<h4 style={{ color: "#3368FF"}}>Choose Ball Acceleration
					<Box sx={{ width: 250 }}>
						<Typography id="non-linear-slider" gutterBottom style={{ color: "#3368FF"}}>
							{acceleration}x
						</Typography>
						<Slider
							value={acceleration}
							min={0}
							step={0.5}
							max={10}
							onChange={handleAccelerationChange}
							valueLabelDisplay="auto"
							aria-labelledby="non-linear-slider"
						/>
					</Box>
				</h4>
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
						</div> }
				<h4 style={{ color: "#3368FF"}}>Game Name</h4>
				&nbsp;
				<input
					type="text"
					id="message"
					name="message"
					maxLength={12}
					onChange={handleTextChange} />
				<p></p>
				{gameNameTaken ?
					<div style={{color: "#FF3333", display: 'inline-block'}}>
						<h4>
							&nbsp;
							This name already exists... choose another
						</h4>
					</div> :
					<></> }
				&nbsp;
				<Button
					variant="contained"
					onClick={() => createGame('public', {
						gameName,
						ballSpeed,
						paddleSize,
						controls,
						acceleration
					})}>
					Create Public Game
				</Button>
				&nbsp;
				<Button
					variant="contained"
					onClick={() => createGame('private', {
						gameName,
						ballSpeed,
						paddleSize,
						controls,
						acceleration
					})}>
					Create Private Game
				</Button>
			</div> : <></> }
		</React.Fragment>
	)
}



