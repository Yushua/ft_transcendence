

export class GameData {
	public static	keysPressed = new Map<string, boolean>()
	public static	gameState = new Map<string, boolean>()
	public static	playerScore: number = 0
	public static 	player_2_Score: number = 0
	public static	player1: Paddle
	public static	player2: Paddle
	public 			ball: Ball
	public static	gameCanvasWidth: number
	public static	gameCanvasHeight: number

	constructor()
	{
		GameData.gameCanvasWidth = 1500
		GameData.gameCanvasHeight = 750
		GameData.gameState.set("newgame", true)
		var paddleWidth:number = 20, paddleHeight:number = 100, ballSize:number = 20, wallOffset:number = 20
		GameData.player1 = new Paddle(paddleWidth,paddleHeight,wallOffset,GameData.gameCanvasHeight / 2 - paddleHeight / 2, 1)
		GameData.player2 = new Paddle(paddleWidth, paddleHeight, GameData.gameCanvasWidth - (wallOffset + paddleWidth), GameData.gameCanvasHeight / 2 - paddleHeight / 2, 2)
		this.ball = new Ball(ballSize,ballSize,GameData.gameCanvasWidth / 2 - ballSize / 2, GameData.gameCanvasHeight / 2 - ballSize / 2, 3)
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
	speed:number
	constructor(w:number,h:number,x:number,y:number, num:number)
	{       
		this.width = w
		this.height = h
		this.x = x
		this.y = y
		this.speed = num
	}
}

export class Paddle extends Entity
{
	update()
	{
		if (GameData.keysPressed.get("ArrowUp"))
		{
			this.yVec = -1
			if (this.y <= 20)
				this.yVec = 0
		}
		else if (GameData.keysPressed.get("ArrowDown"))
		{
			this.yVec = 1
			if (this.y + this.height >= GameData.gameCanvasHeight - 20)
				this.yVec = 0
		}
   		else
			this.yVec = 0
		this.y += this.yVec * this.speed
	}
}

export class Ball extends Entity
{
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
	update()
	{
		var randomDirection = Math.floor(Math.random() * 2) + 1

		//check top canvas bounds
		if (this.y <= 10)
		{
			//update not just 1 or -1 
			this.yVec = 1
		}
		
		//check bottom canvas bounds
		if (this.y + this.height >= GameData.gameCanvasHeight - 10)
		{
			//update not just 1 or -1 
			this.yVec = -1
		}
		
		//check left canvas bounds
		if (this.x <= 0)
		{ 
			this.x = GameData.gameCanvasWidth / 2 - this.width / 2
			this.xVec = -1 * this.xVec
			if (randomDirection % 2)
				this.yVec = 1
			else
				this.yVec = -1
			GameData.player_2_Score += 1
			if (GameData.player_2_Score === 11)
			{
				GameData.gameState.set("game_end", true)
				GameData.gameState.set("P2_won", true)
			}
		}

		//check right canvas bounds
		if (this.x + this.width >= GameData.gameCanvasWidth)
		{
			this.x = GameData.gameCanvasWidth / 2 - this.width / 2
			this.xVec = -1 * this.xVec
			if (randomDirection % 2)
				this.yVec = 1
			else
				this.yVec = -1
			GameData.playerScore += 1
			if (GameData.playerScore === 11)
			{
				GameData.gameState.set("game_end", true)
				GameData.gameState.set("P1_won", true)
			}
		}

		//check player1 collision
		if (this.x <= GameData.player1.x + GameData.player1.width)
		{
			if (this.y >= GameData.player1.y && this.y + this.height <= GameData.player1.y + GameData.player1.height)
			{
				this.xVec = 1;
				if (this.y > GameData.player1.y)
				{
					var yvec_amplifier:number = (this.y - GameData.player1.y) / (GameData.player1.height / 2 )
					this.yVec = 0.5
				}
			}
		}

		//check player2 collision
		if (this.x + this.width >= GameData.player2.x)
		{
			if (this.y >= GameData.player2.y && this.y + this.height <= GameData.player2.y + GameData.player2.height)
				this.xVec = -1;
		}
		this.x += this.xVec * this.speed;
		this.y += this.yVec * this.speed;
	}
}

