import React from 'react'
import { Socket } from 'socket.io-client'
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameData } from '../../../server/src/pong/components/pong_objects'

type MessagePayload = {
	content:string
	msg:string
}

export const RunPong = () => {

	const socket = React.useContext(WebsocketContext)
	const [pending, setPending] = React.useState(false)
	const [connected, setConnected] = React.useState(false)
	const [inGame, setInGame] = React.useState(false)
	const [gameData, setGameData] = React.useState({});
	const [player, setPlayer] = React.useState('')

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
		socket.on('gamedata', (serverData, player) => {
			setGameData(serverData)
			setPlayer(player)
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
			 {pending ? `Waiting for second player...` : inGame ? <RenderPong socket={socket} gameData={gameData} player={player}/> : <button onClick={() => findGame()}>Join Game</button>}
		</div>
	)
}

interface PongProps {
	socket: Socket,
	gameData: GameData
}
  

export class Pong extends React.Component<any, any> {

	private		 	gameCanvas
	private			gameContext

	constructor(props:any)
	{
		super(props)
		this.gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
		this.gameCanvas.width = this.props.gameCanvasWidth
		this.gameCanvas.height = this.props.gameCanvasHeight
		this.gameContext = this.gameCanvas.getContext("2d") as CanvasRenderingContext2D
		this.gameContext.font = "30px Orbitron"
		window.addEventListener("keydown",(event) => { this.props.keysPressed.set(event.key, true) })
		window.addEventListener("keyup",(event) => { this.props.keysPressed.set(event.key, false) })
		window.addEventListener("keypress", (event) => {
			if (event.key === " ")
			{
				if (this.props.gameState.get("newgame"))
					this.props.gameState.set("newgame", false)
				else
					this.props.keysPressed.set("pause", !this.props.keysPressed.get("pause"))
			}
		})
	}

	drawBoardDetails()
	{
		//draw court outline
		this.gameContext.strokeStyle = "#fff"
		this.gameContext.lineWidth = 5
		this.gameContext.strokeRect(10,10,this.gameCanvas.width - 20 ,this.gameCanvas.height - 20)
		//draw center lines
		for (var i = 0; i + 25 < this.gameCanvas.height; i += 25) {
			this.gameContext.fillStyle = "#fff"
			this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 10, 20)
		}
		//draw scores
		const playerScoreString:string = this.props.playerScore.toString()
		const player_2_ScoreString:string = this.props.player_2_Score.toString()
		this.gameContext.fillText(playerScoreString, 375, 50)
		this.gameContext.fillText(player_2_ScoreString, 1125, 50)
		//if new game
		if (this.props.gameState.get("newgame"))
		{
			this.gameContext.fillText("PRESS SPACE", 370, 325)
			this.gameContext.fillText("TO START/PAUSE", 875, 325)
		}
		//if paused
		if (this.props.keysPressed.get("pause"))
		{
			this.gameContext.fillText("GAME", 500, 325)
			this.gameContext.fillText("PAUSED", 875, 325)
		}
		//if game end
		if (this.props.gameState.get("game_end"))
		{
			if (this.props.gameState.get("P1_won"))
				this.gameContext.fillText("WINNER", 315, 95)
			else
				this.gameContext.fillText("WINNER", 1065, 95)
			this.gameContext.fillText("PRESS SPACE", 370, 325)
			this.gameContext.fillText("FOR NEW GAME", 875, 325)
		}
	}
	update()
	{
		if (this.props.keysPressed.get("pause") || this.props.gameState.get("newgame") || this.props.gameState.get("game_end"))
			return
		if (this.props.player === 'p1')
			this.props.player1.update(this.gameCanvas)
		else
			this.props.player2.update(this.gameCanvas)
	}
	draw()
	{
		this.gameContext.fillStyle = "#000"
		this.gameContext.fillRect(0,0,this.gameCanvas.width,this.gameCanvas.height)
		this.drawBoardDetails()
		this.props.player1.draw(this.gameContext, "paddle")
		this.props.player2.draw(this.gameContext, "paddle")
		this.props.ball.draw(this.gameContext, "ball")
  	}
	gameLoop()
	{
		game.update()
		game.draw()
		requestAnimationFrame(game.gameLoop)
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

var game = new Pong('iets')

function StartPong() {
	requestAnimationFrame(game.gameLoop)
}

export class RenderPong extends React.Component<any, any> {
	
	x = StartPong()
	render()
	{
		return (
			<div>
				<Pong socket={this.props.socket}/>
			</div>
		)
	}
}
