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

var game:Canvas
var g_controls = ''


export const Pong = () => {

	var iniGameData = new GameData(0, '', '', '')
	var iniGameList = new Array<string>('')

	const socket = React.useContext(WebsocketContext)
	const [pending, setPending] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)
	const [gameData, setGameData] = React.useState(iniGameData)
	const [gameList, setGameList] = React.useState(iniGameList)
	const [showGameList, setShowGameList] = React.useState(false)
	const [spectating, setSpectating] = React.useState(false)
	const [classicGame, setClassicGame] = React.useState(false)

	React.useEffect(() => {

		var keysPressed: Map<string,boolean> = new Map<string,boolean>()
		var mousePosition:number
		// empty = new Canvas(0, 0)
		
		/* FUNCTIONS TO UPDATE SNAPSHOTS OF DATA USED TO RENDER CANVAS */
		function updateGameData(data:GameData)
		{
			const newData = update(gameData, {
				gameState: {$set: data.gameState},
				gameNum: {$set: data.gameNum},
				gameName: {$set: data.gameName},
				p1_score: {$set: data.p1_score},
				p2_score: {$set: data.p2_score},
				p1_name: {$set: data.p1_name},
				p2_name: {$set: data.p2_name},
				p1: {
					x: {$set: data.p1.x},
					y: {$set: data.p1.y},
					xVec: {$set: data.p1.xVec},
					yVec: {$set: data.p1.yVec},
					speed: {$set: data.p1.speed},
					gameCanvasWidth: {$set: data.p1.gameCanvasWidth},
					gameCanvasHeight: {$set: data.p1.gameCanvasHeight},
					wallOffset: {$set: data.p1.wallOffset},
					width: {$set: data.p1.width},
					height: {$set: data.p1.height},
				},
				p2: {
					x: {$set: data.p2.x},
					y: {$set: data.p2.y},
					xVec: {$set: data.p2.xVec},
					yVec: {$set: data.p2.yVec},
					speed: {$set: data.p2.speed},
					gameCanvasWidth: {$set: data.p2.gameCanvasWidth},
					gameCanvasHeight: {$set: data.p2.gameCanvasHeight},
					wallOffset: {$set: data.p2.wallOffset},
					width: {$set: data.p2.width},
					height: {$set: data.p2.height},
				},
				ball: {
					x: {$set: data.ball.x},
					y: {$set: data.ball.y},
					xVec: {$set: data.ball.xVec},
					yVec: {$set: data.ball.yVec},
					speed: {$set: data.ball.speed},
					gameCanvasWidth: {$set: data.ball.gameCanvasWidth},
					gameCanvasHeight: {$set: data.ball.gameCanvasHeight},
					wallOffset: {$set: data.ball.wallOffset},
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

	const findGame = (controls:string) => {
		let userID = User.ID
		let userName = NameStorage.User.Get(User.ID)
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
				</div> : <></>}

			{inGame ?
				<button onClick={() => leaveGame()}>Leave Game</button> : <></>}
			{showGameList ?
				<GameList list={gameList} socket={socket} />: <></>}
			{inGame ? <></> : <button onClick={() => ShowGameList()}>Game List</button>}
		</div>
	)
}
