import React from 'react'

export class Pong extends React.Component {

	private			gameCanvas
	private			gameContext
	public static	keysPressed = new Map<string, boolean>()
	public static	gameState = new Map<string, boolean>()
	public static	playerScore: number = 0
	public static	player_2_Score: number = 0
	private			player1: Paddle
	private			player2: Paddle
	private			ball: Ball

	constructor()
	{
		super({})
		this.gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
		this.gameCanvas.width = 1500
		this.gameCanvas.height = 750
		this.gameContext = this.gameCanvas.getContext("2d") as CanvasRenderingContext2D
		this.gameContext.font = "30px Orbitron"
		Pong.gameState.set("newgame", true)
		var paddleWidth:number = 20, paddleHeight:number = 100, ballSize:number = 20, wallOffset:number = 20
		this.player1 = new Paddle(paddleWidth,paddleHeight,wallOffset,this.gameCanvas.height / 2 - paddleHeight / 2, 1)
		this.player2 = new Paddle(paddleWidth, paddleHeight, this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2, 2)
		this.ball = new Ball(ballSize,ballSize,this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2, 3)

		window.addEventListener("keydown",(event) => { Pong.keysPressed.set(event.key, true) })
		window.addEventListener("keyup",(event) => { Pong.keysPressed.set(event.key, false) })
		window.addEventListener("keypress", (event) => {
			console.log(event.key)
			if (event.key === " ")
			{
				if (Pong.gameState.get("game_end"))
				{
					Pong.player_2_Score = 0
					Pong.playerScore = 0
					Pong.gameState.set("game_end", false)
					Pong.gameState.set("P1_won", false)
					Pong.gameState.set("P2_won", false)
					Pong.gameState.set("newgame", true)
				}
				else if (Pong.gameState.get("newgame"))
					Pong.gameState.set("newgame", false)
				else
					Pong.keysPressed.set("pause", !Pong.keysPressed.get("pause"))
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
		const playerScoreString:string = Pong.playerScore.toString()
		const player_2_ScoreString:string = Pong.player_2_Score.toString()
		this.gameContext.fillText(playerScoreString, 375, 50)
		this.gameContext.fillText(player_2_ScoreString, 1125, 50)
		//if new game
		if (Pong.gameState.get("newgame"))
		{
			this.gameContext.fillText("PRESS SPACE", 370, 325)
			this.gameContext.fillText("TO START/PAUSE", 875, 325)
		}
		//if paused
		if (Pong.keysPressed.get("pause"))
		{
			this.gameContext.fillText("GAME", 500, 325)
			this.gameContext.fillText("PAUSED", 875, 325)
		}
		//if game end
		if (Pong.gameState.get("game_end"))
		{
			if (Pong.gameState.get("P1_won"))
				this.gameContext.fillText("WINNER", 315, 95)
			else
				this.gameContext.fillText("WINNER", 1065, 95)
			this.gameContext.fillText("PRESS SPACE", 370, 325)
			this.gameContext.fillText("FOR NEW GAME", 875, 325)
		}
	}
	update()
	{
		if (Pong.keysPressed.get("pause") || Pong.gameState.get("newgame") || Pong.gameState.get("game_end"))
			return
		this.player1.update(this.gameCanvas)
		this.player2.update(this.gameCanvas)
		this.ball.update(this.player1,this.player2,this.gameCanvas)
	}
	draw()
	{
		this.gameContext.fillStyle = "#000"
		this.gameContext.fillRect(0,0,this.gameCanvas.width,this.gameCanvas.height)
		this.drawBoardDetails()
		this.player1.draw(this.gameContext, "paddle")
		this.player2.draw(this.gameContext, "paddle")
		this.ball.draw(this.gameContext, "ball")
  	}
	gameLoop()
	{
		game.update()
		game.draw()
		requestAnimationFrame(game.gameLoop)
	}
}

class Entity
{
	width:number
	height:number
	x:number
	y:number
	xVec:number = 0
	yVec:number = 0
	num:number
	constructor(w:number,h:number,x:number,y:number, num:number)
	{       
		this.width = w
		this.height = h
		this.x = x
		this.y = y
		this.num = num
	}
	draw(context: any, shape:string)
	{
		context.fillStyle = "#fff"
		context.fillRect(this.x,this.y,this.width,this.height)
	}
}

class Paddle extends Entity
{

	private speed:number = 12;

	update(canvas: any)
	{
		if ((Pong.keysPressed.get("ArrowUp") && this.num === 2 ) || (Pong.keysPressed.get("a") && this.num === 1))
		{
			this.yVec = -1
			if (this.y <= 20)
				this.yVec = 0
		}
		else if ((Pong.keysPressed.get("ArrowDown") && this.num === 2) || (Pong.keysPressed.get("z") && this.num === 1))
		{
			this.yVec = 1
			if (this.y + this.height >= canvas.height - 20)
				this.yVec = 0
		}
   		else
			this.yVec = 0
		this.y += this.yVec * this.speed
	}
}

class Ball extends Entity
{
	private speed:number = 7

	constructor(w:number,h:number,x:number,y:number, num:number)
	{
		super(w,h,x,y, num);
		var randomDirection = Math.floor(Math.random() * 2) + 1
		if (randomDirection % 2)
			this.xVec = 1
		else
			this.xVec = -1
		randomDirection = Math.floor(Math.random() * 2) + 1
		if (randomDirection % 2)
			this.yVec = 1
		else
			this.yVec = -1
	}
	update(player1:Paddle, player2:Paddle, canvas: any)
	{
		var randomDirection = Math.floor(Math.random() * 2) + 1

		//check top canvas bounds
		if (this.y <= 10)
		{
			//update not just 1 or -1 
			this.yVec = 1
		}
		
		//check bottom canvas bounds
		if (this.y + this.height >= canvas.height - 10)
		{
			//update not just 1 or -1 
			this.yVec = -1
		}
		
		//check left canvas bounds
		if (this.x <= 0)
		{ 
			this.x = canvas.width / 2 - this.width / 2
			this.xVec = -1 * this.xVec
			if (randomDirection % 2)
				this.yVec = 1
			else
				this.yVec = -1
			Pong.player_2_Score += 1
			if (Pong.player_2_Score === 11)
			{
				Pong.gameState.set("game_end", true)
				Pong.gameState.set("P2_won", true)
			}
		}

		//check right canvas bounds
		if (this.x + this.width >= canvas.width)
		{
			this.x = canvas.width / 2 - this.width / 2
			this.xVec = -1 * this.xVec
			if (randomDirection % 2)
				this.yVec = 1
			else
				this.yVec = -1
			Pong.playerScore += 1
			if (Pong.playerScore === 11)
			{
				Pong.gameState.set("game_end", true)
				Pong.gameState.set("P1_won", true)
			}
		}

		//check player1 collision
		if (this.x <= player1.x + player1.width)
		{
			if (this.y >= player1.y && this.y + this.height <= player1.y + player1.height)
			{
				this.xVec = 1;
				if (this.y > player1.y)
				{
					var yvec_amplifier:number = (this.y - player1.y) / (player1.height / 2 )
					this.yVec = 0.5

				}
			}
		}

		//check player2 collision
		if (this.x + this.width >= player2.x)
		{
			if (this.y >= player2.y && this.y + this.height <= player2.y + player2.height)
				this.xVec = -1;
		}
		this.x += this.xVec * this.speed;
		this.y += this.yVec * this.speed;
	}
}

var game = new Pong();
requestAnimationFrame(game.gameLoop);