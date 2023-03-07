import React from 'react'
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameData,  } from './pong_objects'
import { Canvas } from './Canvas'
import update from 'immutability-helper';
import { GameList } from './GameList';

var game:Canvas

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
		
	React.useEffect(() => {

		var keysPressed: Map<string,boolean> = new Map<string,boolean>()

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
		socket.on('joined', () => {
			game = new Canvas(socket)
			setInGame(true)
			setPending(false)
		})
		socket.on('gamedata', (s_gameData:GameData) => {
			updateGameData(s_gameData)
		})
		socket.on('gamelist', (gameList:string[]) => {
			updateGameList(gameList)
		})
		socket.on('spectating', () => {
			game = new Canvas(socket)
			setSpectating(true)
		})
		socket.on('left', (s_gameData:GameData) => {
			setPending(false)
			setInGame(false)
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

		/*  SEND DATA TO SERVER */
		setInterval(() => {
			if (keysPressed.get('ArrowUp'))
				socket.emit('movement', 1)
			if (keysPressed.get('ArrowDown'))
				socket.emit('movement', -1)
		}, 30)

		return () => {
			console.log('unregistering events')
			socket.off('connect')
		}
	}, [socket, gameData])

	const findGame = () => {
		socket.emit('LFG')
	}
	const leaveGame = () => {
		socket.emit('leave')
	}
	const ShowGameList = () => {
		setShowGameList(!showGameList)
	}
	const Return = () => {
		socket.emit('return')
	}

	return (
		<div>
			{pending ? `Waiting for second player...` : <></>}
			{inGame || spectating ?
				<Canvas instance={game} socket={socket} gameData={gameData}/> : <></>}
			{!inGame && !spectating ?
				<button onClick={() => findGame()}>Join Game</button> : <></>}
			{inGame ?
				<button onClick={() => leaveGame()}>Leave Game</button> : <></>}
			{spectating ?
				<button onClick={() => Return()}>Return</button> : <></>}
			{showGameList ?
				<GameList list={gameList} socket={socket} />: <></>}
			{inGame ? <></> : <button onClick={() => ShowGameList()}>Game List</button>}
		</div>
	)
}


// return (
// 	<div>
// 		{pending ?
// 			 `Waiting for second player...` :
// 		inGame || spectating ?
// 			<Canvas instance={game} socket={socket} gameData={gameData}/> :
// 			<button onClick={() => findGame()}>Join Game</button>}
// 		{inGame ?
// 			<button onClick={() => leaveGame()}>Leave Game</button> :
// 		showGameList ?
// 			<GameList list={gameList} socket={socket} />: 
// 			<button onClick={() => ShowGameList()}>Game List</button>}
// 	</div>
// )
