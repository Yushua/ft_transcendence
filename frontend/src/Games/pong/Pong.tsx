import React from 'react'
import PracticeModeLoop from './practice_mode/practice_mode';
import User from '../../Utils/Cache/User';
import NameStorage from '../../Utils/Cache/NameStorage';
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameData,  } from './components/GameData'
import { Canvas } from './components/Canvas'
import { GameList } from './components/GameList';
import { JoinClassicButton } from './components/JoinClassicButton';
import { CreateGameButton } from './components/CreateGameButton';
import { Button } from '@mui/material'
import { SetMainWindow } from '../../MainWindow/MainWindow'
import { JoinPrivateButton } from './components/PrivateGameButton';
import { EmptyCanvas } from './components/EmtpyCanvas';
import { Tab, Tabs } from "@mui/material";
import { ClassicPongTab } from './components/ClassicPongTab';
import CustomPongTab from './components/CustomPongTab';
import SpectateTab from './components/SpectateTab';
import './Pong.css'

export function SetMainGameWindow(window: string) {
	if (!!_setMainWindow_)
		_setMainWindow_(window)
}
var _setMainWindow_: React.Dispatch<React.SetStateAction<string>> | null = null

//if spectating -> show player names ? 
//endless game ?

var g_controls = ''
var iniGameData = new GameData()
var iniGameListMap = new Map<string, string[]>()
var iniCustomGames = new Map<string, any[]>()
var firstCall:boolean = true

const Enum = {
	pending: 0,
	inGame: 1,
	spectating: 2,
	showGameList: 3,
	gameData: 4,
	activeGames: 5,
	customGames: 6,
	gameCreated: 7,
	window: 8
}

/* Store states for when user switches windows and comes back  */
var localStorage = new Array<any>()
localStorage[Enum.pending] = false
localStorage[Enum.inGame] = false
localStorage[Enum.spectating] = false
localStorage[Enum.showGameList] = false
localStorage[Enum.gameData] = iniGameData
localStorage[Enum.activeGames] = iniGameListMap
localStorage[Enum.customGames] = iniCustomGames
localStorage[Enum.gameCreated] = false
localStorage[Enum.window] = 'classic'


export const Pong = () => {

	let canvas:Canvas = new Canvas('')
	let userID = User.ID
	let userName = NameStorage.User.Get(User.ID)
	
	const socket = React.useContext(WebsocketContext)
	const gameName = React.useRef('')

	const [pending, setPending] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)
	const [spectating, setSpectating] = React.useState(false)
	const [showGameList, setShowGameList] = React.useState(false)
	const [gameData, setGameData] = React.useState(iniGameData)
	const [activeGames, setActiveGames] = React.useState(iniGameListMap)
	const [customGames, setCustomGames] = React.useState(iniCustomGames)
	const [gameCreated, setGameCreated] = React.useState(false)
	const [gameID, setGameID] = React.useState('')
	const [MainWindow, setMainWindow] = React.useState<string>("classic")
	_setMainWindow_ = setMainWindow

	/* reset states to locally stored states if user comes back to window */
	if (!firstCall)
	{
		setPending(localStorage[Enum.pending])
		setInGame(localStorage[Enum.inGame])
		setSpectating(localStorage[Enum.spectating])
		setShowGameList(localStorage[Enum.showGameList])
		setGameData(localStorage[Enum.gameData])
		setActiveGames(localStorage[Enum.activeGames])
		setCustomGames(localStorage[Enum.customGames])
		setGameCreated(localStorage[Enum.gameCreated])
		setMainWindow(localStorage[Enum.window])
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

		socket.on('pending', () => {
			setPending(true)
			localStorage[Enum.pending] = true
		})
		socket.on('stop_pending', () => {
			setPending(false)
			localStorage[Enum.pending] = false
		})
		socket.on('joined', (controls:string) => {
			SetMainWindow("pong")
			setMainWindow('canvas')
			setInGame(true)
			setPending(false)
			setGameCreated(false)
			localStorage[Enum.window] = 'canvas'
			localStorage[Enum.inGame] = true
			localStorage[Enum.pending] = false
			localStorage[Enum.gameCreated] = false
			g_controls = controls
		})
		socket.on('gamedata', (s_gameData:GameData) => {
			updateGameData(s_gameData)
		})
		socket.on('gamelist', (serializedGamesMap:any) => {
			updateActiveGames(serializedGamesMap)
		})
		socket.on('custom_gamelist', (serializedGamesMap:any) => {
			updateCustomGames(serializedGamesMap)
		})
		socket.on('game_created', (gamename:string, gameID:string) => {
			setShowGameList(false)
			setGameCreated(true)
			if (gameID)
				setGameID(gameID)
			localStorage[Enum.showGameList] = false
			localStorage[Enum.gameCreated] = true
			gameName.current = gamename
		})
		socket.on('spectating', () => {
			setSpectating(true)
			setShowGameList(false)
			SetMainWindow("pong")
			setMainWindow('canvas')
			localStorage[Enum.window] = 'canvas'
			localStorage[Enum.spectating] = true
			localStorage[Enum.showGameList] = false
		})
		socket.on('left', () => {
			setPending(false)
			setInGame(false)
			setSpectating(false)
			setShowGameList(false)
			setGameCreated(false)
			setMainWindow('classic')
			setGameID('')
			localStorage[Enum.pending] = false
			localStorage[Enum.inGame] = false
			localStorage[Enum.spectating] = false
			localStorage[Enum.showGameList] = false
			localStorage[Enum.gameCreated] = false
			localStorage[Enum.window] = 'classic'
			g_controls = ''
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

	/*  SEND DATA TO SERVER */
	React.useEffect(() => {
		var keysPressed: Map<string,boolean> = new Map<string,boolean>()
		var mousePosition:number

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
	},[socket])
	
	/* BUTTON HANDLERS */
	const leaveGame = () => {
		PracticeModeLoop.Stop()
		setGameID('')
		socket.emit('leave', gameData.gameName)
	}

	function ShowGameList() {
		socket.emit('refreshGameList')
		setShowGameList(!showGameList)
		localStorage[Enum.showGameList] = !localStorage[Enum.showGameList]
	}

	function deleteGame(gameName:string) {
		socket.emit('deleteCreatedGame', gameName)
		setGameCreated(false)
		setGameID('')
		localStorage[Enum.gameCreated] = false
	}

	function StartPracticeGame() {
		setInGame(true)
		setPending(false)
		localStorage[Enum.inGame] = true
		localStorage[Enum.pending] = false
		g_controls = "mouse"
		const gamaData = new GameData()
		PracticeModeLoop.Start(gamaData, setGameData)
	}

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
			_window = <CustomPongTab/>	
			break;
		case "spectate":
			_window = <SpectateTab socket={socket} activeGames={activeGames} />
			break;
	
	}

	//JSX 
	return (
		
		<React.Fragment>
			<Tabs value={MainWindow} centered>
				<Tab label="Classic Pong" value="classic" onClick={() => setMainWindow("classic")}/>
				<Tab label="Custom Pong" value="custom" onClick={() => setMainWindow("custom")}/>
				<Tab label="Spectate" value="spectate" onClick={() => setMainWindow("spectate")}/>
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

		// <React.Fragment>
		// 	&nbsp;
		// 	{pending ? `Waiting for second player...` : <></>}
		// 	{inGame || spectating ?
		// 			<Canvas instance={canvas} socket={socket} gameData={gameData}/> :
		// 			<EmptyCanvas></EmptyCanvas>}
		// 	{!inGame && !spectating && !gameCreated ?
		// 	<div>
		// 		<div><JoinClassicButton socket={socket} userID={userID} userName={userName}/></div>
		// 		&nbsp;
		// 		<div><JoinPrivateButton socket={socket} userID={userID} userName={userName}/></div>
		// 		&nbsp;
		// 		<div><CreateGameButton socket={socket} userID={userID} userName={userName}/></div>
		// 		&nbsp;
		// 		<div><Button variant="contained" onClick={() => StartPracticeGame()}>Practice Mode</Button></div>	
		// 	</div> : <></>}
		// 	{inGame ? 
		// 		<div>
		// 			<Button variant="contained" onClick={() => leaveGame()}>Leave Game</Button> 
		// 		</div> :
		// 		<div>
		// 			&nbsp;
		// 			{spectating ? <Button variant="contained" onClick={() => leaveGame()}>Stop Spectating</Button> : <></> }
		// 		</div>}
		// 	{!inGame && !gameCreated && !spectating ? <GameList userID={userID} userName={userName} customGames={customGames} activeGames={activeGames} socket={socket} /> : <></>}
		// 	{gameCreated ?
		// 		<div>
		// 			<div>
		// 				{gameID !== '' ? <>Code to join game: {gameID}</> : <>Waiting for players...</>}
		// 			</div>
		// 			<Button variant="contained" onClick={() => deleteGame(gameName.current)}>Delete Game</Button>
		// 		</div> : <></> }
		// </React.Fragment>
	)
}
