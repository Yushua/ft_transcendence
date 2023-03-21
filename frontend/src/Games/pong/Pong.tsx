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
	const [gameData, setGameData] = React.useState(iniGameData)
	const [activeGames, setActiveGames] = React.useState(iniGameListMap)
	const [customGames, setCustomGames] = React.useState(iniCustomGames)
	const [gameCreated, setGameCreated] = React.useState(false)
	const [gameName, setGameName] = React.useState('')

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
		function updateActiveGames(games:Map<string, string[]>)
		{
			let newActiveGames = new Map<string, string[]>()
			newActiveGames = games
			setActiveGames(newActiveGames)
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
			let games:Map<string, string[]> = new Map<string, string[]>()
			for (var instance of serializedGamesMap) {
				games.set(instance[0], [instance[1][0].p1_name, instance[1][0].p2_name])
			}
			updateActiveGames(games)
		})

		socket.on('custom_gamelist', (serializedGamesMap:any) => {
			let customGamesMap:Map<string, any[]> = new Map<string, any[]>()
			for (var instance of serializedGamesMap) {
				customGamesMap.set(instance[0], [instance[1][0].p1_name, instance[1][0].p1_controls, instance[1][0].ballSpeed, instance[1][0].paddleSize])
			}
			updateCustomGames(customGamesMap)
		})
		socket.on('game_created', (gameName:string) => {
			setShowGameList(false)
			setGameCreated(true)
			setGameName(gameName)
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
			setGameCreated(false)
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
			console.log('unregistering events')
			socket.off('connect')
			socket.off('pending')
			socket.off('stop_pending')
			socket.off('joined')
			socket.off('left')
			socket.off('gamedata')
			socket.off('gamelist')
			socket.off('custom_gamelist')
			socket.off('spectating')
			socket.off('disconnect')
			g_controls = ''	

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

	function deleteGame(gameName:string) {
		socket.emit('deleteCreatedGame', gameName)
		setGameCreated(false)
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
			{!inGame && !spectating && !gameCreated ?
				<ul>
					<li>
						<JoinClassicButton socket={socket} userID={userID} userName={userName}/>
					</li>
					&nbsp;
					<li>
						<CreateGameButton socket={socket} userID={userID} userName={userName}/>
					</li>
					&nbsp;
					<li><Button variant="contained" onClick={() => StartPracticeGame()}>Practice Mode</Button></li>
				</ul> : <></>}
			{inGame ? 
				<div>
					<Button variant="contained" onClick={() => leaveGame()}>Leave Game</Button> 
				</div> :
				<div>
					&nbsp;
					{spectating ?
							<Button variant="contained" onClick={() => leaveGame()}>Stop Spectating</Button> :
							!gameCreated ?
								<Button variant="outlined" onClick={() => ShowGameList()}>Game List</Button> : <></> }
				</div>}
			{showGameList && !inGame && !gameCreated ? <GameList userID={userID} userName={userName} customGames={customGames} activeGames={activeGames} socket={socket} /> : <></>}
			{gameCreated ?
				<div>
					<>Waiting for players...</>
					<Button variant="contained" onClick={() => deleteGame(gameName)}>Delete Game</Button>
				</div> : <></> }
		</React.Fragment>
	)
}