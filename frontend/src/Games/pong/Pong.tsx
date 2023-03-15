import React from 'react'
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameData,  } from './components/GameData'
import { Canvas } from './components/Canvas'
import update from 'immutability-helper';
import { GameList } from './components/GameList';
import { EmptyCanvas } from './components/EmtpyCanvas';
import whale1 from './components/whale1.jpg'
import User from '../../Utils/Cache/User';
import HTTP from '../../Utils/HTTP';
import NameStorage from '../../Utils/Cache/NameStorage';
import { Box, Slider, Typography } from '@mui/material';
import { LabelDisplayedRowsArgs } from '@mui/base';

var game:Canvas
var g_controls = ''


export const Pong = () => {

	var iniGameData = new GameData()
	var iniGameList = new Array<string>('')
	let userID = User.ID
	let userName = NameStorage.User.Get(User.ID)

	const socket = React.useContext(WebsocketContext)
	const [pending, setPending] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)
	const [gameData, setGameData] = React.useState(iniGameData)
	const [gameList, setGameList] = React.useState(iniGameList)
	const [showGameList, setShowGameList] = React.useState(false)
	const [spectating, setSpectating] = React.useState(false)
	const [classicGame, setClassicGame] = React.useState(false)
	const [customGame, setCustomGame] = React.useState(false)
	const [ballSpeed, setBallSpeed] = React.useState(100)
	const [paddleSize, setPaddleSize] = React.useState(100)

	React.useEffect(() => {

		var keysPressed: Map<string,boolean> = new Map<string,boolean>()
		var mousePosition:number
		
		/* FUNCTIONS TO UPDATE DATA USED TO RENDER CANVAS */
		function updateGameData(data:GameData)
		{
			const newData = update(gameData, {
				gameState: {$set: data.gameState},
				p1_score: {$set: data.p1_score},
				p2_score: {$set: data.p2_score},
				p1: {
					x: {$set: data.p1.x},
					y: {$set: data.p1.y},
					width: {$set: data.p1.width},
					height: {$set: data.p1.height},
				},
				p2: {
					x: {$set: data.p2.x},
					y: {$set: data.p2.y},
					width: {$set: data.p2.width},
					height: {$set: data.p2.height},
				},
				ball: {
					x: {$set: data.ball.x},
					y: {$set: data.ball.y},
					width: {$set: data.ball.width},
					height: {$set: data.ball.height},
				}
			})
			setGameData(newData)
		}
	
		function updateGameList(list:string[])
		{
			let newList = new Array<string>()
			newList = list
			setGameList(newList)
		}
				
		/* INCOMING EVENTS ON SOCKET */
		socket.on('connect', () => {
			console.log('connected with gateway!', socket.id)
		})
		socket.on('pending', () => {
			setPending(true)
		})
		socket.on('joined', (controls:string) => {
			game = new Canvas('')
			setInGame(true)
			setPending(false)
			g_controls = controls
		})
		socket.on('gamedata', (s_gameData:GameData) => {
			updateGameData(s_gameData)
		})
		socket.on('gamelist', (gameList:string[]) => {
			updateGameList(gameList)
		})
		socket.on('spectating', () => {
			game = new Canvas('')
			setSpectating(true)
		})
		socket.on('left', (s_gameData:GameData) => {
			setPending(false)
			setInGame(false)
			setShowGameList(false)
			setClassicGame(false)
		})
		socket.on('disconnect', () => {
			socket.emit('user disconnected')
		})
		
		/*  EVENTLISTENERS */
		window.addEventListener('keydown', (event) => {
			keysPressed.set(event.key, true)
		})
		window.addEventListener('keyup', (event) => {
			keysPressed.set(event.key, false)
		})
		window.addEventListener("mousemove", (event) => {
			mousePosition = event.y
		})
		
		/*  SEND DATA TO SERVER */
		setInterval(() => {
		// console.log('controls:', g_controls)
			if (g_controls === 'keyboard')
			{	
				if (keysPressed.get('ArrowUp'))
					socket.emit('keyboard_movement', 1)
				if (keysPressed.get('ArrowDown'))
					socket.emit('keyboard_movement', -1)
			}
			else if (g_controls === 'mouse')
				socket.emit('mouse_movement', mousePosition)
		}, 10)

		return () => {
			console.log('unregistering events')
			socket.off('connect')
		}
	}, [socket])

	/* BUTTON HANDLERS */
	const findGame = (controls:string) => {
		socket.emit('LFG', {controls, userID, userName})
	}
	const leaveGame = () => {
		socket.emit('leave')
	}
	const ShowGameList = () => {
		setShowGameList(!showGameList)
	}
	const isClassicGame = () => {
		setClassicGame(!classicGame)
	}
	const isCustomGame = () => {
		setCustomGame(!customGame)
	}
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
	const createGame = (customSettings: any) => {
		socket.emit('createGame', {userID, userName, customSettings})
	}

	return (
		<div>
			{pending ? `Waiting for second player...` : <></>}
			{inGame || spectating ?
				<Canvas instance={game} socket={socket} gameData={gameData}/> : <EmptyCanvas/>}
			{!inGame && !spectating ?
				<div className='menu-container'>
					<div className='menu-trigger'>
						<img src={whale1}></img>
					</div>
					<div className='dropdown-menu'>
						<button onClick={() => isClassicGame()}>Join Classic Game</button>
						{classicGame ? 
						<ul>
							<li className='dropdownItem'><button onClick={() => findGame('mouse')}>Mouse</button></li>
							<li className='dropdownItem'><button onClick={() => findGame('keyboard')}>Keyboard</button></li>
						</ul> : <></> }
					</div>
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
								{/* <value></value> */}
							<li className='dropdownItem'><button onClick={() => createGame({ballSpeed, paddleSize})}>Create Game</button></li>
						</ul> : <></> }
					</div>
				</div> : <></>}
			{inGame ?
				<button onClick={() => leaveGame()}>Leave Game</button> : <></>}
			{showGameList ?
				<GameList list={gameList} socket={socket} />: <></>}
			{inGame ? <></> : <button onClick={() => ShowGameList()}>Game List</button>}
		</div>
	)
}
