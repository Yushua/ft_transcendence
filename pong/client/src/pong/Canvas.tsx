import React from "react"
import { Socket } from "socket.io-client"
import { GameData, Ball, Paddle } from "./pong_objects"


export class Canvas extends React.Component<any, any> {

	private	gameCanvas
	private	gameContext
	// private socket:Socket

	constructor(socket:Socket)
	{
		super(socket)
		console.log('id:', socket.id)
		this.gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
		this.gameCanvas.width = 1500
		this.gameCanvas.height = 750
		this.gameContext = this.gameCanvas.getContext("2d") as CanvasRenderingContext2D
		this.gameContext.font = "30px Orbitron"
	}
	draw(gameData: GameData)
	{
		this.gameContext.fillStyle = "#000"
		this.gameContext.fillRect(0,0,this.gameCanvas.width,this.gameCanvas.height)
		//draw court outline
		this.gameContext.strokeStyle = "#fff"
		this.gameContext.lineWidth = 5
		this.gameContext.strokeRect(10,10,this.gameCanvas.width - 20 ,this.gameCanvas.height - 20)
		//draw center lines
		for (var i = 0; i + 25 < this.gameCanvas.height; i += 25) {
			this.gameContext.fillStyle = "#fff"
			this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 10, 20)
		}
		//draw player scores
		const playerScoreString:string = gameData.p1_score.toString()
		const player_2_ScoreString:string = gameData.p2_score.toString()
		this.gameContext.fillText(playerScoreString, 375, 50)
		this.gameContext.fillText(player_2_ScoreString, 1125, 50)
		//if game end
		if (gameData.gameState === "p1_won" || gameData.gameState === "p2_won")
		{
			if (gameData.gameState === "p1_won")
				this.gameContext.fillText("WINNER", 315, 95)
			else
				this.gameContext.fillText("WINNER", 1065, 95)
		}
		//draw paddles and ball
		gameData.ball.draw(this.gameContext)
		gameData.p1.draw(this.gameContext)
		gameData.p2.draw(this.gameContext)

	}
	loop()
	{

	}
	render()
	{
		console.log(this.props)
		// Pong.socket = this.props.socket
		// console.log('data:', this.props.gameData)
		if (this.props.gameData.p1_score === undefined)
			return ( <h3>loading...</h3>)
		this.props.instance.draw(this.props.gameData)
		// canvas.draw(this.props.gameData)
		return (<></>)
	}
}
// console.log('check2')
// var canvas = new Pong('')

// export class RenderPong extends React.Component<any, any> {
// 	public static socket:Socket

// 	render()
// 	{
// 		RenderPong.socket = this.props.socket
// 		// console.log('data:', this.props.gameData)
// 		if (this.props.gameData.p1_score === undefined)
// 			return ( <h3>loading...</h3>)
// 		canvas.draw(this.props.gameData, this.props.p1, this.props.p2, this.props.ball)
// 		return (
// 			<div>
// 				<Pong socket={this.props.socket} />
// 			</div>
// 		)
// 	}

// }
