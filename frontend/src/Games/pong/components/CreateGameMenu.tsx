import { Button, Box, Slider, Typography } from '@mui/material'
import { useState, Fragment} from 'react'

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

export var CreatingGameData: {gameID: string | null} = {gameID:null}

export const CreateGameMenu = (props:any) => {
	const [ballSpeed, setBallSpeed] = useState(100)
	const [acceleration, setBallAcceleration] = useState(0.5	)
	const [paddleSize, setPaddleSize] = useState(100)
	const [controls, setControls] = useState('mouse')
	const [gameName, setGameName] = useState('')
	const [isMouse, setIsMouse] = useState(true)
	const [gameNameTaken, setGameNameTaken] = useState(false)
	const [emptyName, setEmptyName] = useState(false)
	const [maxScore, setMaxScore] = useState(11)

	props.socket.on('gamename taken', () => {
		setGameNameTaken(true)
	})
	props.socket.on('no_game_name', () => {
		setEmptyName(true)
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

	const handleScoreChange = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setMaxScore(newValue);
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
			CreatingGameData.gameID = gameID
		}
		props.socket.emit('createGame', {type, gameID, userID, userName, customSettings})
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
		<Fragment>
			<div>
				<h4 style={{ color: "#3368FF"}}>Game Name</h4>
				<input
					type="text"
					id="message"
					name="message"
					maxLength={12}
					autoComplete="off"
					onChange={handleTextChange} />
				<p></p>
				{isMouse ?
					<div>
						<Button variant="contained" onClick={() => setMouse()}>Mouse</Button>
						&nbsp;
						<Button variant="outlined" onClick={() => setKeyboard()}>Keyboard</Button> 
					</div>
				:
					<div>
						<Button variant="outlined" onClick={() => setMouse()}>Mouse</Button>
						&nbsp;
						<Button variant="contained" onClick={() => setKeyboard()}>Keyboard</Button>
					</div> }
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
							min={20}
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
				<p></p>
				<h4 style={{ color: "#3368FF"}}>Choose Max Score
					<Box sx={{ width: 250 }}>
						<Typography id="non-linear-slider" gutterBottom style={{ color: "#3368FF"}}>
							{maxScore}
						</Typography>
						<Slider
							value={maxScore}
							min={1}
							step={1}
							max={50}
							onChange={handleScoreChange}
							valueLabelDisplay="auto"
							aria-labelledby="non-linear-slider"
						/>
					</Box>
				</h4>
				<p></p>
				<Button
					variant="contained"
					onClick={() => createGame('public', {
						gameName,
						ballSpeed,
						paddleSize,
						controls,
						acceleration,
						maxScore
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
						acceleration,
						maxScore
					})}>
					Create Private Game
				</Button>
				<p></p>
				{gameNameTaken ?
					<div style={{color: "#FF3333", display: 'inline-block'}}>
						<h4>
							&nbsp;
							Game name already exists... choose another
						</h4>
					</div>
				:
					<></> }
				{emptyName ?
					<div style={{color: "#FF3333", display: 'inline-block'}}>
						<h4>
							&nbsp;
							Game name is empty, please fill in a name
						</h4>
					</div>
				:
					<></> }
			

			</div>
		</Fragment>
	)
}



