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
import { CustomGameList, CustomGames } from './components/CustomGames';

var game:Canvas
var g_controls = ''

export const Pong = () => {

	var iniGameData = new GameData()
	var iniGameListMap = new Map<string, string[]>()
	var iniCustomGames = new Map<string, any[]>()
	let userID = User.ID
	let userName = NameStorage.User.Get(User.ID)

	const socket = React.useContext(WebsocketContext)
	const [pending, setPending] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)
	const [spectating, setSpectating] = React.useState(false)
	const [showGameList, setShowGameList] = React.useState(false)
	const [showCustomGames, setShowCustomGames] = React.useState(false)
	const [gameData, setGameData] = React.useState(iniGameData)
	const [gameListMap, setGameListMap] = React.useState(iniGameListMap)
	const [customGames, setCustomGames] = React.useState(iniCustomGames)

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
	
		function updateCustomGames(customGameListMap:Map<string, any[]>)
		{
			let newCustomGames = new Map<string, any[]>()
			newCustomGames = customGameListMap
			setCustomGames(newCustomGames)
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
		socket.on('stop_pending', () => {
			setPending(false)
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

		socket.on('custom_gamelist', (serializedGamesMap:any) => {
			let customGamesMap:Map<string, any[]> = new Map<string, any[]>()
			for (var instance of serializedGamesMap) {
				customGamesMap.set(instance[0], [instance[1][0].p1_name, instance[1][0].p1_controls, instance[1][0].ballSpeed, instance[1][0].paddleSize])
			}
			updateCustomGames(customGamesMap)
		})

		socket.on('spectating', () => {
			game = new Canvas('')
			setSpectating(true)
			setShowGameList(false)
		})
		socket.on('left', (s_gameData:GameData) => {
			setPending(false)
			setInGame(false)
			setSpectating(false)
			setShowGameList(false)
			setShowCustomGames(false)
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
		g_controls = ''
		socket.emit('leave', gameData.gameName)
	}
	function ShowGameList() {
		socket.emit('refreshGameList')
		setShowGameList(!showGameList)
	}
	function ShowCustomGames() {
		socket.emit('refreshCustomGames')
		setShowCustomGames(!showCustomGames)
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
					</li>
					&nbsp;
					<li>
						<CreateGameButton socket={socket} userID={userID} userName={userName}/>
					</li>
					&nbsp;
					<li><Button variant="outlined" onClick={() => ShowCustomGames()}>Join Custom Game</Button></li>
					&nbsp;
					<li><Button variant="contained" onClick={() => StartPracticeGame()}>Practice Mode</Button></li>
				</ul> : <></>}
			{inGame ? <button onClick={() => leaveGame()}>Leave Game</button> :
				<div>
					&nbsp;
					{spectating ?
							<Button variant="contained" onClick={() => leaveGame()}>Stop Spectating</Button> :
							<Button variant="outlined" onClick={() => ShowGameList()}>Game List</Button>}
				</div>}
			{showCustomGames && !inGame ? <CustomGameList customGames={customGames} socket={socket} userID={userID} userName={userName} /> : <></>}
			{showGameList && !inGame ? <GameList listmap={gameListMap} socket={socket} /> : <></>}
		</React.Fragment>
	)
}