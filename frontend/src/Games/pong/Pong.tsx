import React from 'react'
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameData,  } from './components/GameData'
import { Canvas } from './components/Canvas'
import update from 'immutability-helper';
import { GameList } from './components/GameList';
import { EmptyCanvas } from './components/EmtpyCanvas';
import User from '../../Utils/Cache/User';
import NameStorage from '../../Utils/Cache/NameStorage';
import { JoinClassicButton } from './components/JoinClassicButton';
import { CreateGameButton } from './components/CreateGameButton';
import { Button } from '@mui/material'
import PracticeModeLoop from './practice_mode/practice_mode';

var game:Canvas
var g_controls = ''
var iniGameData = new GameData()
var iniGameListMap = new Map<string, string[]>()

export const Pong = () => {

	// var iniGameData = new GameData()
	// var iniGameListMap = new Map<string, string[]>()

	let userID = User.ID
	let userName = NameStorage.User.Get(User.ID)

	const socket = React.useContext(WebsocketContext)
	const [pending, setPending] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)
	const [gameData, setGameData] = React.useState(iniGameData)
	const [gameListMap, setGameListMap] = React.useState(iniGameListMap)
	const [showGameList, setShowGameList] = React.useState(false)
	const [spectating, setSpectating] = React.useState(false)
	const [showCustomGameList, setCustomShowGameList] = React.useState(false)
	
	React.useEffect(() => {

		var keysPressed: Map<string,boolean> = new Map<string,boolean>()
		var mousePosition:number
		
		/* FUNCTIONS TO UPDATE DATA USED TO RENDER CANVAS */
		function updateGameData(data:GameData)
		{
			const newData = update(gameData, {
				gameState: {$set: data.gameState},
				gameName: {$set: data.gameName},
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
	
		function updateGameListMap(gameListMap:Map<string, string[]>)
		{
			let newListMap = new Map<string, string[]>()
			newListMap = gameListMap
			setGameListMap(newListMap)
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
		socket.on('gamelist', (serializedGamesMap:any) => {
			let gamesMap:Map<string, string[]> = new Map<string, string[]>()
			for (var instance of serializedGamesMap) {
				gamesMap.set(instance[0], [instance[1][0].p1_name, instance[1][0].p2_name])
			}
			updateGameListMap(gamesMap)
		})
		socket.on('spectating', () => {
			game = new Canvas('')
			setSpectating(true)
		})
		socket.on('left', (s_gameData:GameData) => {
			setPending(false)
			setInGame(false)
			setSpectating(false)
			setShowGameList(false)
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
			PracticeModeLoop.SetMousePosition(mousePosition)
		})

		/*  SEND DATA TO SERVER */
		setInterval(() => {
			if (g_controls === 'keyboard')
			{	
				if (keysPressed.get('ArrowUp'))
					socket.emit('keyboard_movement', 1)
				if (keysPressed.get('ArrowDown'))
					socket.emit('keyboard_movement', -1)
			}
			else if (g_controls === 'mouse') {
				socket.emit('mouse_movement', mousePosition)
			}
		}, 10)

		return () => {
			/* ATTEMPT RECONNECT */
			socket.emit('reconnect')
			console.log('unregistering events')
			socket.off('connect')
		}
	}, [socket])


	/* BUTTON HANDLERS */
	const leaveGame = () => {
		PracticeModeLoop.Stop()
		socket.emit('leave', gameData.gameName)
	}
	function ShowGameList() {
		socket.emit('refreshGameList')
		setShowGameList(!showGameList)
	}
	function ShowCustomGameList() {
		setShowGameList(!showGameList)
	}
	
	function StartPracticeGame() {
		game = new Canvas('')
		setInGame(true)
		setPending(false)
		g_controls = "mouse"
		
		const gamaData = new GameData()
		PracticeModeLoop.Start(gamaData, setGameData)
	}

	return (
		<React.Fragment>
			&nbsp;
			{pending ? `Waiting for second player...` : <></>}
			{inGame || spectating ? <Canvas instance={game} socket={socket} gameData={gameData}/> : <EmptyCanvas/>}
			{!inGame && !spectating ?
				<ul>
					<li>
						<JoinClassicButton socket={socket} userID={userID} userName={userName}/>
						<CreateGameButton socket={socket} userID={userID} userName={userName}/>
					</li>
					&nbsp;
					<li><button onClick={() => ShowCustomGameList()}>Join Custom Game</button></li>
					&nbsp;
					<li><button onClick={() => StartPracticeGame()}>Practice Mode</button></li>
				</ul> : <></>}
			{inGame ? <button onClick={() => leaveGame()}>Leave Game</button> :
				<div>
					{spectating ?
						<div>
							<button onClick={() => ShowGameList()}>Game List</button>
							<button onClick={() => leaveGame()}>Stop Spectating</button>
						</div> :
							<button onClick={() => ShowGameList()}>Game List</button>}
				</div>}
			{showGameList && !inGame? <GameList listmap={gameListMap} socket={socket} /> : <></>}
		</React.Fragment>
	)
}




















// import React from 'react'
// import { WebsocketContext } from "../contexts/WebsocketContext"
// import { GameData,  } from './components/GameData'
// import { Canvas } from './components/Canvas'
// import update from 'immutability-helper';
// import { GameList } from './components/GameList';
// import { EmptyCanvas } from './components/EmtpyCanvas';
// import whale1 from './components/whale1.jpg'
// import User from '../../Utils/Cache/User';
// import HTTP from '../../Utils/HTTP';
// import NameStorage from '../../Utils/Cache/NameStorage';
// import { Button, Box, Slider, Typography } from '@mui/material';
// import { LabelDisplayedRowsArgs } from '@mui/base';
// import { JoinClassicButton } from './components/JoinClassicButton';

// var game:Canvas
// var g_controls = ''


// export const Pong = () => {
// 	var iniGameData = new GameData()
// 	var iniGameListMap = new Map<string, string[]>()

// 	let userID = User.ID
// 	let userName = NameStorage.User.Get(User.ID)

// 	const socket = React.useContext(WebsocketContext)
// 	const [pending, setPending] = React.useState(false)
// 	const [inGame, setInGame] = React.useState(false)
// 	const [gameData, setGameData] = React.useState(iniGameData)
// 	const [gameListMap, setGameListMap] = React.useState(iniGameListMap)
// 	const [showGameList, setShowGameList] = React.useState(false)
// 	const [spectating, setSpectating] = React.useState(false)
// 	const [classicGame, setClassicGame] = React.useState(false)
// 	const [customGame, setCustomGame] = React.useState(false)
// 	const [ballSpeed, setBallSpeed] = React.useState(100)
// 	const [paddleSize, setPaddleSize] = React.useState(100)
// 	const [controls, setControls] = React.useState('mouse')

// 	React.useEffect(() => {

// 		var keysPressed: Map<string,boolean> = new Map<string,boolean>()
// 		var mousePosition:number
		
// 		/* FUNCTIONS TO UPDATE DATA USED TO RENDER CANVAS */
// 		function updateGameData(data:GameData)
// 		{
// 			const newData = update(gameData, {
// 				gameState: {$set: data.gameState},
// 				p1_score: {$set: data.p1_score},
// 				p2_score: {$set: data.p2_score},
// 				p1: {
// 					x: {$set: data.p1.x},
// 					y: {$set: data.p1.y},
// 					width: {$set: data.p1.width},
// 					height: {$set: data.p1.height},
// 				},
// 				p2: {
// 					x: {$set: data.p2.x},
// 					y: {$set: data.p2.y},
// 					width: {$set: data.p2.width},
// 					height: {$set: data.p2.height},
// 				},
// 				ball: {
// 					x: {$set: data.ball.x},
// 					y: {$set: data.ball.y},
// 					width: {$set: data.ball.width},
// 					height: {$set: data.ball.height},
// 				}
// 			})
// 			setGameData(newData)
// 		}
	
// 		function updateGameListMap(gameListMap:Map<string, string[]>)
// 		{
// 			let newListMap = new Map<string, string[]>()
// 			newListMap = gameListMap
// 			setGameListMap(newListMap)
// 		}

// 		/* INCOMING EVENTS ON SOCKET */
// 		socket.on('connect', () => {
// 			console.log('connected with gateway!', socket.id)
// 		})
// 		socket.on('pending', () => {
// 			setPending(true)
// 		})
// 		socket.on('joined', (controls:string) => {
// 			game = new Canvas('')
// 			setInGame(true)
// 			setPending(false)
// 			g_controls = controls
// 		})
// 		socket.on('gamedata', (s_gameData:GameData) => {
// 			updateGameData(s_gameData)
// 		})
// 		socket.on('gamelist', (serializedGamesMap:any) => {
// 			let gamesMap:Map<string, string[]> = new Map<string, string[]>()
// 			for (var instance of serializedGamesMap) {
// 				gamesMap.set(instance[0], [instance[1][0].p1_name, instance[1][0].p2_name])
// 			}
// 			updateGameListMap(gamesMap)
// 		})
// 		socket.on('spectating', () => {
// 			game = new Canvas('')
// 			setSpectating(true)
// 		})
// 		socket.on('left', (s_gameData:GameData) => {
// 			setPending(false)
// 			setInGame(false)
// 			setSpectating(false)
// 			setShowGameList(false)
// 			setClassicGame(false)
// 		})
// 		socket.on('disconnect', () => {
// 			socket.emit('user disconnected')
// 		})
		
// 		/*  EVENTLISTENERS */
// 		window.addEventListener('keydown', (event) => {
// 			keysPressed.set(event.key, true)
// 		})
// 		window.addEventListener('keyup', (event) => {
// 			keysPressed.set(event.key, false)
// 		})
// 		window.addEventListener("mousemove", (event) => {
// 			mousePosition = event.y
// 		})
		
// 		/*  SEND DATA TO SERVER */
// 		setInterval(() => {
// 		// console.log('controls:', g_controls)
// 			if (g_controls === 'keyboard')
// 			{	
// 				if (keysPressed.get('ArrowUp'))
// 					socket.emit('keyboard_movement', 1)
// 				if (keysPressed.get('ArrowDown'))
// 					socket.emit('keyboard_movement', -1)
// 			}
// 			else if (g_controls === 'mouse')
// 				socket.emit('mouse_movement', mousePosition)
// 		}, 10)

// 		return () => {
// 			console.log('unregistering events')
// 			socket.off('connect')
// 		}
// 	}, [socket])

// 	/* BUTTON HANDLERS */
// 	const findGame = (controls:string) => {
// 		socket.emit('LFG', {controls, userID, userName})
// 	}
// 	const leaveGame = () => {
// 		socket.emit('leave')
// 	}
// 	function ShowGameList() {
// 		setShowGameList(!showGameList)
// 	}
// 	const isClassicGame = () => {
// 		setClassicGame(!classicGame)
// 	}
// 	const setMouse = () => {
// 		setControls('mouse')
// 	}
// 	const setKeyboard = () => {
// 		setControls('keyboard')
// 	}

// 	const isCustomGame = () => {
// 		setCustomGame(!customGame)
// 	}
// 	const handleBallChange = (event: Event, newValue: number | number[]) => {
// 		if (typeof newValue === 'number') {
// 			setBallSpeed(newValue);
// 		}
// 	}
// 	const handlePaddleChange = (event: Event, newValue: number | number[]) => {
// 		if (typeof newValue === 'number') {
// 			setPaddleSize(newValue);
// 		}
// 	}
// 	const createGame = (customSettings: any,) => {
// 		socket.emit('createGame', {userID, userName, customSettings})
// 	}
// 	return (
// 		<div>
// 			<p></p>
// 			{pending ? `Waiting for second player...` : <></>}
// 			{inGame || spectating ?
// 				<Canvas instance={game} socket={socket} gameData={gameData}/> : <EmptyCanvas/>}
// 			{!inGame && !spectating ?
// 				<div className='menu-container'>
// 					<div className='menu-trigger'>
// 						<img src={whale1}></img>
// 					</div>
// 					<div className='dropdown-menu'>
// 						<button onClick={() => isClassicGame()}>Join Classic Game</button>
// 						{classicGame ? 
// 						<ul>
// 							<li className='dropdownItem'><button onClick={() => findGame('mouse')}>Mouse</button></li>
// 							<li className='dropdownItem'><button onClick={() => findGame('keyboard')}>Keyboard</button></li>
// 						</ul> : <></> }
// 					</div>
// 					<div className='dropdown-menu'>
// 						<button onClick={() => isCustomGame()}>Create Unranked Custom Game</button>
// 						{customGame ? 
// 						<ul>
// 							<li className='dropdownItem'>Choose Ball Speed</li>
// 								<Box sx={{ width: 250 }}>
// 									<Typography id="non-linear-slider" gutterBottom>
// 										{ballSpeed}%
// 									</Typography>
// 									<Slider
// 										value={ballSpeed}
// 										min={100}
// 										step={1}
// 										max={200}
// 										onChange={handleBallChange}
// 										valueLabelDisplay="auto"
// 										aria-labelledby="non-linear-slider"
// 									/>
// 								</Box>
// 							<li className='dropdownItem'>Choose Paddle Size</li>
// 								<Box sx={{ width: 250 }}>
// 									<Typography id="non-linear-slider" gutterBottom>
// 										{paddleSize}%
// 									</Typography>
// 									<Slider
// 										value={paddleSize}
// 										min={5}
// 										step={1}
// 										max={500}
// 										onChange={handlePaddleChange}
// 										valueLabelDisplay="auto"
// 										aria-labelledby="non-linear-slider"
// 									/>
// 								</Box>
// 							<li className='dropdownItem'>
// 								<p>Controls: {controls} </p>
// 								<Button variant="outlined" onClick={() => setMouse()}>Mouse</Button>
// 								<Button variant="outlined" onClick={() => setKeyboard()}>Keyboard</Button>
// 							</li>
// 							<p></p>
// 							<li className='dropdownItem'><Button variant="contained" onClick={() => createGame({ballSpeed, paddleSize, controls})}>Create Game</Button></li>
// 						</ul> : <></> }
// 					</div>
// 				</div> : <></>}
// 			{inGame ?
// 				<div>
// 					<button onClick={() => leaveGame()}>Leave Game</button> 
// 				</div> :
// 				<div>
// 					{spectating ?
// 						<div>
// 							<button onClick={() => ShowGameList()}>Game List</button>
// 							<button onClick={() => leaveGame()}>Stop Spectating</button>
// 						</div> :
// 							<button onClick={() => ShowGameList()}>Game List</button>}
// 				</div>}
// 			{showGameList ?
// 				<div>
// 					<GameList listmap={gameListMap} socket={socket} />
// 				</div> : <></>}
// 		</div>
// 	)
// }
