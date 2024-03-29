import React from "react"
import { GameData } from "./GameData"
import PracticeModeLoop from "../practice_mode/practice_mode"

export class Canvas extends React.Component<any, any> {

	private	gameCanvas: HTMLCanvasElement
	private	gameContext: CanvasRenderingContext2D
	
	static CurrentGameCanvas: HTMLCanvasElement | null = null
	static readonly InternalSize = {width: 1500, height: 750}
	// private socket:Socket

	constructor(props:any)
	{
		super(props)
		this.gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
		this.gameCanvas.width = Canvas.InternalSize.width
		this.gameCanvas.height = Canvas.InternalSize.height
		this.gameContext = this.gameCanvas.getContext("2d") as CanvasRenderingContext2D
		this.gameContext.font = "30px Orbitron"

		Canvas.CurrentGameCanvas = this.gameCanvas
	}
	draw(gameData: GameData)
	{
		//draw background
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
		if (!PracticeModeLoop.IsRunning()) {
			const playerScoreString:string = gameData.p1_score.toString()
			const player_2_ScoreString:string = gameData.p2_score.toString()
			this.gameContext.fillText(playerScoreString, 375, 50)
			this.gameContext.fillText(player_2_ScoreString, 1125, 50)
		}
		else {
			this.gameContext.fillText("Practice", 315, 50)
			this.gameContext.fillText("Mode", 1100, 50)
		}
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
	render()
	{
		if (this.props.gameData.p1_score === undefined)
			return ( <h3>loading...</h3>)
		this.props.instance.draw(this.props.gameData)
		return
	}
}