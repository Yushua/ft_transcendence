import React from "react"
import { GameData, Ball, Paddle } from "./pong_objects"


export class Canvas extends React.Component<any, any> {

	private	gameCanvas
	private	gameContext

	constructor(props:any)
	{
		super(props)
		this.gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
		this.gameCanvas.width = 1500
		this.gameCanvas.height = 750
		this.gameContext = this.gameCanvas.getContext("2d") as CanvasRenderingContext2D
		this.gameContext.font = "30px Orbitron"
	}
	draw(gameData: GameData, p1:Paddle, p2:Paddle, ball:Ball)
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
		//if new game
		if (gameData.gameState === "newgame")
		{
			this.gameContext.fillText("PRESS SPACE", 370, 325)
			this.gameContext.fillText("TO START/PAUSE", 875, 325)
		}
		//if paused
		// if (gameData.gameState === "pause")
		// {
		// 	this.gameContext.fillText("GAME", 500, 325)
		// 	this.gameContext.fillText("PAUSED", 875, 325)
		// }
		//if game end
		if (gameData.gameState === "p1_won" || gameData.gameState === "p2_won")
		{
			if (gameData.gameState === "p1_won")
				this.gameContext.fillText("WINNER", 315, 95)
			else
				this.gameContext.fillText("WINNER", 1065, 95)
			this.gameContext.fillText("PRESS SPACE", 370, 325)
			this.gameContext.fillText("FOR NEW GAME", 875, 325)
		}
		//draw paddles and ball
		console.log('check')
		p1.draw(this.gameContext)
		p2.draw(this.gameContext)
		ball.draw(this.gameContext)
	}
	render()
	{
		return (<></>)
	}
}

var canvas = new Canvas('')

export class RenderCanvas extends React.Component<any, any> {
	render()
	{
		console.log('data:', this.props.gameData, this.props.p1, this.props.p2, this.props.ball)
		if (this.props.gameData.p1_score === undefined)
			return ( <h3>loading...</h3>)
		canvas.draw(this.props.gameData, this.props.p1, this.props.p2, this.props.ball)
		return (
			<div>
				{/* <Canvas gameData={this.props.gameData} /> */}
			</div>
		)
	}

}
