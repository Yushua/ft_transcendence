import React from 'react'
import { Socket } from 'socket.io-client'
import { WebsocketContext } from "../contexts/WebsocketContext"
import { Paddle, GameData, Ball } from './pong_objects'

type MessagePayload = {
	content:string
	msg:string
}

export const RunPong = () => {

	const socket = React.useContext(WebsocketContext)
	const [pending, setPending] = React.useState(false)
	const [connected, setConnected] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)
	const [gameData, setGameData] = React.useState({
		gameState: 'newgame',
		winner: '',
		p1_score: 0,
		p2_score: 0,
		p1: new Paddle(7, 1, 1500, 750, 20, 20, 100),
		p2: new Paddle(7, 2, 1500, 750, 20, 20, 100),
		ball: new Ball(12, 3, 1500, 750, 20, 20, 20),
		gameCanvasWidth: 1500,
		gameCanvasHeight: 750,
		paddleWidth: 20,
		paddleHeight: 100,
		ballSize: 20,
		wallOffset: 20,
	})
	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('connected with gateway!', socket.id)
			setConnected(true)
		})
		socket.on('onMessage', (newMessage: MessagePayload) => {
			console.log(newMessage.msg)
			console.log(newMessage.content)
		})
		socket.on('pending', () => {
			setPending(true)
		})
		socket.on('joined', (gamename: string) => {
			console.log(gamename)
			setInGame(true)
			setPending(false)
		})
		socket.on('gamedata', (serverData) => {
			//check if useReducer is usable and how
			console.log('serverdata:', serverData)
			setGameData({...gameData,
				...gameData,
				...serverData
				// gameState: serverData.gameState,
				// p1_score: serverData.p1_score,
				// p2_score: serverData.p2_score,
				// p1: serverData.p1,
				// p2: serverData.p2,
				// ball: serverData.ball,
				// gameCanvasWidth: serverData.gameCanvasWidth,
				// gameCanvasHeight: serverData.gameCanvasHeight,
				// paddleWidth: serverData.paddleWidth,
				// paddleHeight: serverData.paddleHeight,
				// ballSize: serverData.ballSize,
				// wallOffset: serverData.wallOffset,
			})
			console.log('gamedata', gameData)


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
			 {pending ? `Waiting for second player...` : inGame ? <Pong socket={socket} gameData={gameData}/> : <button onClick={() => findGame()}>Join Game</button>}
		</div>
	)
}

export class RenderPong extends React.Component<any, any> {

	private	gameCanvas
	private	gameContext

	constructor(props:any)
	{
		super(props)
		console.log('props', props)
		this.gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
		this.gameCanvas.width = props.gameData.gameCanvasWidth
		this.gameCanvas.height = props.gameData.gameCanvasHeight
		this.gameContext = this.gameCanvas.getContext("2d") as CanvasRenderingContext2D
		this.gameContext.font = "30px Orbitron"
		window.addEventListener("keydown",(event) => { this.props.gameData.keysPressed.set(event.key, true) })
		window.addEventListener("keyup",(event) => { this.props.gameData.keysPressed.set(event.key, false) })
		window.addEventListener("keypress", (event) => {
			if (event.key === " ")
			{
				if (this.props.gameData.gameState === "newgame")
					this.props.gameData.gameState = "running"
				else
					this.props.gameData.keysPressed.set("pause", !this.props.gameData.keysPressed.get("pause"))
			}
		})
	}

	drawBoardDetails()
	{
		//draw court outline
		this.gameContext.strokeStyle = "#fff"
		this.gameContext.lineWidth = 5
		this.gameContext.strokeRect(10,10,this.props.gameData.gameCanvasWidth - 20 ,this.props.gameData.gameCanvasHeight - 20)
		//draw center lines
		for (var i = 0; i + 25 < this.props.gameData.gameCanvasHeight; i += 25) {
			this.gameContext.fillStyle = "#fff"
			this.gameContext.fillRect(this.props.gameData.gameCanvasWidth / 2 - 10, i + 10, 10, 20)
		}
		//draw scores
		const playerScoreString:string = this.props.gameData.playerScore.toString()
		const player_2_ScoreString:string = this.props.gameData.player_2_Score.toString()
		this.gameContext.fillText(playerScoreString, 375, 50)
		this.gameContext.fillText(player_2_ScoreString, 1125, 50)
		//if new game
		if (this.props.gameData.gameState === "newgame")
		{
			this.gameContext.fillText("PRESS SPACE", 370, 325)
			this.gameContext.fillText("TO START/PAUSE", 875, 325)
		}
		//if paused
		if (this.props.gameData.keysPressed.get("pause"))
		{
			this.gameContext.fillText("GAME", 500, 325)
			this.gameContext.fillText("PAUSED", 875, 325)
		}
		//if game end
		if (this.props.gameData.gameState === "end")
		{
			if (this.props.gameData.winner === "p1")
				this.gameContext.fillText("WINNER", 315, 95)
			else
				this.gameContext.fillText("WINNER", 1065, 95)
			this.gameContext.fillText("PRESS SPACE", 370, 325)
			this.gameContext.fillText("FOR NEW GAME", 875, 325)
		}
	}
	update()
	{
		if (this.props.gameData.keysPressed.get("pause") || this.props.gameData.gameState === "newgame" || this.props.gameData.gameState === "end")
			return
		if (this.props.gameData.player === 'p1')
			this.props.gameData.player1.update(this.gameCanvas)
		else
			this.props.gameData.player2.update(this.gameCanvas)
	}
	draw()
	{
		this.gameContext.fillStyle = "#000"
		this.gameContext.fillRect(0,0,this.props.gameData.gameCanvasWidth,this.props.gameData.gameCanvasHeight)
		this.drawBoardDetails()
		this.props.gameData.p1.draw(this.gameContext, "paddle")
		this.props.gameData.p2.draw(this.gameContext, "paddle")
		this.props.gameData.ball.draw(this.gameContext, "ball")
  	}
	gameLoop()
	{
		this.update()
		this.draw()
		requestAnimationFrame(this.gameLoop)
	}
	render()
	{
		return (
			<div>
				<h3>Controls:</h3>
				<h4>Left player: A/Z </h4>
				<h4>Right player: Up/Down </h4>
				<h4>Pause: space</h4>
			</div>
		)
	}
}


function StartPong(props:any) {
	if (props.gameData.gameCanvasWidth === undefined)
		return -1
	var game = new RenderPong(props)
	requestAnimationFrame(game.gameLoop)
}

export class Pong extends React.Component<any, any> {
	x = StartPong(this.props)		
	render()
	{
		if (this.x === -1)
			return ( <div>loading...</div>)
		return (
			<div>
				{/* <RenderCanvas />
				<RenderPaddles />
				<RenderScores />
				<RenderBall /> */}
				<RenderPong socket={this.props.socket} gameData={this.props.gameData} />


			</div>
		)
	}
}
