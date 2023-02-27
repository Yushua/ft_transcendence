import React from 'react'
import { WebsocketContext } from "../contexts/WebsocketContext"
import { Paddle, GameData, Ball } from './pong_objects'
import { RenderCanvas } from './Canvas'

var ini_GameData = new GameData
var ini_p1 = new Paddle(7, 1, 1500, 750, 20, 20, 100)
var ini_p2 = new Paddle(7, 2, 1500, 750, 20, 20, 100)
var ini_ball = new Ball(12, 3, 1500, 750, 20, 20, 20)

export const RunPong = () => {

	const socket = React.useContext(WebsocketContext)
	const [pending, setPending] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)
	const [gameData, setGameData] = React.useState(ini_GameData)
	const [p1, setP1] = React.useState(ini_p1)
	const [p2, setP2] = React.useState(ini_p2)
	const [ball, setBall] = React.useState(ini_ball)

	function updateGameData(data:GameData, s_p1:Paddle, s_p2:Paddle, s_ball:Ball)
	{
		var new_GameData = new GameData
		var new_p1 = new Paddle(7, 1, 1500, 750, 20, 20, 100)
		var new_p2 = new Paddle(7, 2, 1500, 750, 20, 20, 100)
		var new_ball = new Ball(12, 3, 1500, 750, 20, 20, 20)

		new_GameData.gameState = data.gameState
		new_GameData.p1_score = data.p1_score
		new_GameData.p2_score = data.p2_score

		new_p1.x = s_p1.x
		new_p1.y = s_p1.y
		new_p1.xVec = s_p1.xVec
		new_p1.yVec = s_p1.yVec
		new_p1.speed = s_p1.speed
		new_p1.gameCanvasWidth = s_p1.gameCanvasWidth
		new_p1.gameCanvasHeight = s_p1.gameCanvasHeight
		new_p1.wallOffset = s_p1.wallOffset
		new_p1.width = s_p1.width
		new_p1.height = s_p1.height

		new_p2.x = s_p2.x
		new_p2.y = s_p2.y
		new_p2.xVec = s_p2.xVec
		new_p2.yVec = s_p2.yVec
		new_p2.speed = s_p2.speed
		new_p2.gameCanvasWidth = s_p2.gameCanvasWidth
		new_p2.gameCanvasHeight = s_p2.gameCanvasHeight
		new_p2.wallOffset = s_p2.wallOffset
		new_p2.width = s_p2.width
		new_p2.height = s_p2.height

		new_ball.x = s_ball.x
		new_ball.y = s_ball.y
		new_ball.xVec = s_ball.xVec
		new_ball.yVec = s_ball.yVec
		new_ball.speed = s_ball.speed
		new_ball.gameCanvasWidth = s_ball.gameCanvasWidth
		new_ball.gameCanvasHeight = s_ball.gameCanvasHeight
		new_ball.wallOffset = s_ball.wallOffset
		new_ball.width = s_ball.width
		new_ball.height = s_ball.height

		setGameData(new_GameData)
		setP1(new_p1)
		setP2(new_p2)
		setBall(new_ball)
	}

	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('connected with gateway!', socket.id)
		})
		socket.on('pending', () => {
			setPending(true)
		})
		socket.on('joined', (gamename: string) => {
			console.log(gamename)
			setInGame(true)
			setPending(false)
		})
		socket.on('gamedata', (s_gameData:GameData, s_p1:Paddle, s_p2:Paddle, s_ball:Ball) => {
			//check if useReducer is usable and how
			// console.log('serverdata:', s_gameData)
			// console.log('p1:', s_p1)
			// console.log('p2:', s_p2)
			// console.log('s_ball.x:', s_ball.x)
			// console.log('ball:x', ball.x)
			updateGameData(s_gameData, s_p1, s_p2, s_ball)
			// console.log('gamedata', gameData)
			// console.log('ball:x', ball.x)
		})

		return () => {
			console.log('unregistering events')
			socket.off('connect')
			socket.off('onMessage')
		}
	}, [socket])

	const findGame = () => {
		socket.emit('LFG')
	}

	return (
		<div>
			 {pending ? `Waiting for second player...` : inGame ? <Pong socket={socket} gameData={gameData} p1={p1} p2={p2} ball={ball}/> : <button onClick={() => findGame()}>Join Game</button>}
		</div>
	)
}

class Pong extends React.Component<any, any> {
	render()
	{
		console.log('data as props:', this.props.gameData)
		return (
			<div>
				<RenderCanvas gameData={this.props.gameData} p1={this.props.p1} p2={this.props.p2} ball={this.props.ball}/>
				{/* <RenderPaddles />
				<RenderBall /> */}
			</div>
		)
	}
}
