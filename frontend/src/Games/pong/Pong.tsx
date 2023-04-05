import React from 'react'
import PracticeModeLoop from './practice_mode/practice_mode';
import User from '../../Utils/Cache/User';
import NameStorage from '../../Utils/Cache/NameStorage';
import { socket } from "../contexts/WebsocketContext"
import { GameData,  } from './components/GameData'
import { Canvas } from './components/Canvas'
import { Button } from '@mui/material'
import { SetMainWindow } from '../../MainWindow/MainWindow'
import { Tab, Tabs } from "@mui/material";
import { ClassicPongTab } from './components/ClassicPongTab';
import { CustomPongTab } from './components/CustomPongTab';
import SpectateTab from './components/SpectateTab';
import './Pong.css'
import { CreatingGameData } from './components/CreateGameMenu';

export function SetMainGameWindow(window:string) {
	if (!!_setMainWindow_)
		_setMainWindow_(window)
}
var _setMainWindow_: React.Dispatch<React.SetStateAction<string>> | null = null

//if spectating -> show player names ? 
//endless game ?

var g_controls = ''
var iniGameData = new GameData()
var iniActiveGames = new Map<string, string[]>()
var iniCustomGames = new Map<string, any[]>()
var firstCall:boolean = true
var keysPressed: Map<string,boolean> = new Map<string,boolean>()
var mousePosition:number

const Enum = {
	spectating: 0,
	gameData: 1,
	window: 2,
	activeGames: 3,
	customGames: 4,
}

/* Store states for when user switches windows and comes back  */
var localStorage = new Array<any>()
localStorage[Enum.spectating] = false
localStorage[Enum.gameData] = iniGameData
localStorage[Enum.window] = 'classic'
localStorage[Enum.activeGames] = iniActiveGames
localStorage[Enum.customGames] = iniCustomGames

export const Pong = () => {

	let canvas:Canvas = new Canvas('')
	let userID = User.ID
	let userName = NameStorage.User.Get(User.ID)

	const [spectating, setSpectating] = React.useState(false)
	const [gameData, setGameData] = React.useState(iniGameData)
	const [activeGames, setActiveGames] = React.useState(iniActiveGames)
	const [customGames, setCustomGames] = React.useState(iniCustomGames)

	const [MainWindow, setMainPongTab] = React.useState<string>("classic")
	_setMainWindow_ = setMainPongTab

	/* reset states to locally stored states if user comes back to window */
	if (!firstCall)
	{
		setSpectating(localStorage[Enum.spectating])
		setGameData(localStorage[Enum.gameData])
		setMainPongTab(localStorage[Enum.window])
		setActiveGames(localStorage[Enum.activeGames])
		setCustomGames(localStorage[Enum.customGames])
		firstCall = true
	}

	/*  */
	React.useEffect(() => {
		/* FUNCTIONS TO UPDATE DATA USED TO RENDER CANVAS */
		function updateGameData(data:GameData)
		{
			const newData = new GameData()
			newData.gameState = data.gameState
			newData.gameName = data.gameName
			newData.isClassic = data.isClassic
			newData.p1_score = data.p1_score
			newData.p2_score = data.p2_score

			newData.p1.x = data.p1.x
			newData.p1.y = data.p1.y
			newData.p1.width = data.p1.width
			newData.p1.height = data.p1.height

			newData.p2.x = data.p2.x
			newData.p2.y = data.p2.y
			newData.p2.width = data.p2.width
			newData.p2.height = data.p2.height

			newData.ball.x = data.ball.x	
			newData.ball.y = data.ball.y
			newData.ball.width = data.ball.width
			newData.ball.height = data.ball.height
			setGameData(newData)
			localStorage[Enum.gameData] = newData
		}

		function updateCustomGames(serializedGamesMap:any)
		{
			let customGamesMap:Map<string, any[]> = new Map<string, any[]>()
			for (var instance of serializedGamesMap) {
				customGamesMap.set(instance[0], [instance[1][0].p1_name, instance[1][0].p1_controls, instance[1][0].ballSpeed, instance[1][0].paddleSize])
			}
			setCustomGames(customGamesMap)
			localStorage[Enum.customGames] = customGamesMap
		}

		function updateActiveGames(serializedGamesMap:any)
		{
			console.log('map', serializedGamesMap)
			let games:Map<string, string[]> = new Map<string, string[]>()
			for (var instance of serializedGamesMap) {
				games.set(instance[0], [instance[1][0].p1_name, instance[1][0].p2_name, instance[1][0].isClassic])
			}
			setActiveGames(games)
			localStorage[Enum.activeGames] = games
		}

		/* INCOMING EVENTS ON SOCKET */
		socket.on('connect', () => {
			console.log('connected with gateway!', socket.id)
		})

		socket.on('joined', (controls:string) => {
			CreatingGameData.gameID = null
			SetMainWindow("pong")
			setMainPongTab('canvas')
			localStorage[Enum.window] = 'canvas'
			g_controls = controls
		})
		socket.on('gamedata', (s_gameData:GameData) => {
			updateGameData(s_gameData)
		})
		// socket.on('refresh', () => {
		// 	if (window)
		// })

		socket.on('spectating', () => {
			setSpectating(true)
			setMainPongTab("pong")
			setMainPongTab('canvas')
			localStorage[Enum.window] = 'canvas'
			localStorage[Enum.spectating] = true
		})
		socket.on('left', () => {
			setSpectating(false)
			setMainPongTab('classic')
			localStorage[Enum.spectating] = false
			localStorage[Enum.window] = 'classic'
			g_controls = ''
		})
		socket.on('gamelist', (serializedGamesMap:any) => {
			updateActiveGames(serializedGamesMap)
		})
		socket.on('custom_gamelist', (serializedGamesMap:any) => {
			updateCustomGames(serializedGamesMap)
		})
		socket.on('disconnect', () => {
			socket.emit('user disconnected')
		})
		/* cleanup function after user leaves window/disconnects */
		return () => {
			PracticeModeLoop.Stop()
			const gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
			if (!gameCanvas)
				return
			gameCanvas.width = 0
			gameCanvas.height = 0
			firstCall = false
		}
	},[socket])
	
	/* BUTTON HANDLERS */
	const leaveGame = () => {
		PracticeModeLoop.Stop()
		socket.emit('leave', gameData.gameName)
	}

	//JSX 
	var _window
	switch (MainWindow) {
		default:
			return <></>
		case "canvas" :
			return (
				<div>
					<Canvas instance={canvas} socket={socket} gameData={gameData}/>
					{spectating ?
						<Button variant="contained" onClick={() => leaveGame()}>Stop Spectating</Button>
					:
						<Button variant="contained" onClick={() => leaveGame()}>Leave Game</Button> }
				</div>
			)
		case "classic":
			_window = <ClassicPongTab socket={socket} userID={userID} userName={userName}/>
			break;
		case "custom":
			_window = <CustomPongTab socket={socket} userID={userID} userName={userName} customGames={customGames} />	
			break;
		case "spectate":
			_window = <SpectateTab socket={socket} activeGames={activeGames}/>
			break;
	
	}
	return (
		<React.Fragment>
			<Tabs value={MainWindow} centered>
				<Tab label="Classic Pong" value="classic" onClick={() => setMainPongTab("classic")}/>
				<Tab label="Custom Pong" value="custom" onClick={() => setMainPongTab("custom")}/>
				<Tab label="Spectate" value="spectate" onClick={() => setMainPongTab("spectate")}/>
			</Tabs>

			{/* MetaDiv */}
			<div
				style={{
					// border: (MainWindow === "chat" ? "solid" : "none"),
					color: "#3676cc",
					borderColor: "#3676cc", borderRadius: ".1cm",
					width: "100%", height: "5.6cm", lineHeight: ".5cm"}}
			>
				{/* ContentTable */}
				<div style={{display: "table", width: "100%", height: "100%", color: "black"}}>
					{_window}
				</div>
			</div>
		</React.Fragment>
	)
}

/*  EVENTLISTENERS */
window.addEventListener('keydown', (event) => {
	keysPressed.set(event.key, true)
})
window.addEventListener('keyup', (event) => {
	keysPressed.set(event.key, false)
})
window.addEventListener("mousemove", (event) => {
	const canvas = Canvas.CurrentGameCanvas
	let scale:number
	if (canvas) {
		scale = Canvas.InternalSize.height / canvas.offsetHeight
		mousePosition = (event.y - canvas.offsetTop) * scale
		PracticeModeLoop.SetMousePosition(mousePosition)
	}
})

/* EMIT */
setInterval(() => {
	if (socket) {
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
	}
}, 10)

export function JoinedGame(controls:string) {
	SetMainWindow("pong")
	_setMainWindow_('canvas')
	localStorage[Enum.window] = 'canvas'
	g_controls = controls
}

