export class GameData {
	gameState = new Map<string, boolean>()
	p1_score: number = 0
	p2_score: number = 0
	p1: Paddle
	p2: Paddle
	ball: Ball
	gameCanvasWidth: number = 1500
	gameCanvasHeight: number = 750
	paddleWidth:number = 20
	paddleHeight:number = 100
	ballSize:number = 20
	wallOffset:number = 20
	constructor()
	{
		this.gameState.set("newgame", true)
		this.p1 = new Paddle(7, 1, this.gameCanvasWidth, this.gameCanvasHeight, this.wallOffset, this.paddleWidth, this.paddleHeight)
		this.p2 = new Paddle(7, 2, this.gameCanvasWidth, this.gameCanvasHeight, this.wallOffset, this.paddleWidth, this.paddleHeight)
		this.ball = new Ball(1, 3, this.gameCanvasWidth, this.gameCanvasHeight, this.wallOffset, this.ballSize, this.ballSize)
	}
	update()
	{
		this.p1.update()
		this.p2.update()
		this.ball.update(this.p1, this.p2)
	}
}

class Entity 
{
	x:number
	y:number
	xVec:number = 0
	yVec:number = 0
	speed:number
	gameCanvasWidth:number
	gameCanvasHeight:number
	wallOffset:number
	width:number
	height:number

	constructor(
		speed:number,
		type:number,
		gameCanvasWidth:number,
		gameCanvasHeight:number,
		wallOffset:number,
		width:number,
		height:number,
		)
	{
		this.gameCanvasWidth = gameCanvasWidth
		this.gameCanvasHeight = gameCanvasHeight
		this.wallOffset = wallOffset
		this.speed = speed
		this.width = width
		this.height = height
		this.y = this.gameCanvasHeight / 2 - this.height / 2
		this.x = this.wallOffset
		if (type === 2)
			this.x = this.gameCanvasWidth - (this.wallOffset + this.width)
		if (type === 3)
		{
			this.x = this.gameCanvasWidth / 2 - this.width / 2
			this.y = this.gameCanvasHeight / 2 - this.width / 2
		}
	}
}

export class Paddle extends Entity
{
	public 	keysPressed = new Map<string, boolean>()

	update()
	{
		if (this.keysPressed.get("ArrowUp"))
		{
			this.yVec = -1
			if (this.y <= 20)
				this.yVec = 0
		}
		else if (this.keysPressed.get("ArrowDown"))
		{
			this.yVec = 1
			if (this.y + this.height >= this.gameCanvasHeight - 20)
				this.yVec = 0
		}
   		else
			this.yVec = 0
		this.y += this.yVec * this.speed
	}
}

export class Ball extends Entity
{
	constructor(
		speed:number,
		type:number,
		gameCanvasWidth:number,
		gameCanvasHeight:number,
		wallOffset:number,
		width:number,
		height:number,
		)
	{
	super (
		speed,
		type,
		gameCanvasWidth,
		gameCanvasHeight,
		wallOffset,
		width,
		height,	
		)
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
	update(p1:Paddle, p2:Paddle)
	{
		var randomDirection = Math.floor(Math.random() * 2) + 1

		//check top canvas bounds
		if (this.y <= 10)
		{
			//update not just 1 or -1 
			this.yVec = 1
		}
		//check bottom canvas bounds
		if (this.y + this.height >= this.gameCanvasHeight - 10)
		{
			//update not just 1 or -1 
			this.yVec = -1
		}
		//check left canvas bounds
		if (this.x <= 0)
		{ 
			this.x = this.gameCanvasWidth / 2 - this.height / 2
			this.xVec = -1 * this.xVec
			if (randomDirection % 2)
				this.yVec = 1
			else
				this.yVec = -1
			// this.player_2_Score += 1
			// if (this.player_2_Score === 11)
			// {
			// 	this.gameState.set("game_end", true)
			// 	this.gameState.set("P2_won", true)
			// }
		}

		//check right canvas bounds
		if (this.x + this.height >= this.gameCanvasWidth)
		{
			this.x = this.gameCanvasWidth / 2 - this.height / 2
			this.xVec = -1 * this.xVec
			if (randomDirection % 2)
				this.yVec = 1
			else
				this.yVec = -1
			// this.playerScore += 1
			// if (this.playerScore === 11)
			// {
			// 	this.gameState.set("game_end", true)
			// 	this.gameState.set("P1_won", true)
			// }
		}

		//check player1 collision
		if (this.x <= p1.x + p1.width)
		{
			if (this.y >= p1.y && this.y + this.height <= p1.y + p1.height)
			{
				this.xVec = 1;
				if (this.y > p1.y)
				{
					var yvec_amplifier:number = (this.y - p1.y) / (p1.height / 2 )
					this.yVec = 0.5
				}
			}
		}

		//check player2 collision
		if (this.x + this.height >= p2.x)
		{
			if (this.y >= p2.y && this.y + this.height <= p2.y + p2.height)
				this.xVec = -1;
		}
		this.x += this.xVec * this.speed;
		this.y += this.yVec * this.speed;
	}
}


// export class GameData {
// 	gameState = new Map<string, boolean>()
// 	playerScore: number = 0
// 	player_2_Score: number = 0
// 	p1: Paddle
// 	p2: Paddle
// 	ball: Ball
// 	gameCanvasWidth: number
// 	gameCanvasHeight: number
// 	paddleWidth:number = 20
// 	paddleHeight:number = 100
	
// 	constructor()
// 	{
// 		this.gameCanvasWidth = 1500
// 		this.gameCanvasHeight = 750
// 		this.gameState.set("newgame", true)
// 		var paddleWidth:number = 20,
// 			paddleHeight:number = 100,
// 			ballSize:number = 20,
// 			wallOffset:number = 20
// 		this.p1 = new Paddle
// 			// paddleWidth,
// 			// paddleHeight,
// 			// wallOffset,
// 			// this.gameCanvasHeight / 2 - paddleHeight / 2,
// 			// this.gameCanvasHeight,
// 			// 7,
// 			// 1)
// 		this.p2 = new Paddle(
// 			paddleWidth,
// 			paddleHeight,
// 			this.gameCanvasWidth - (wallOffset + paddleWidth),
// 			this.gameCanvasHeight / 2 - paddleHeight / 2,
// 			this.gameCanvasHeight,
// 			7,
// 			2)
// 		this.ball = new Ball(
// 			ballSize,
// 			ballSize,
// 			this.gameCanvasWidth / 2 - ballSize / 2,
// 			this.gameCanvasHeight / 2 - ballSize / 2,
// 			this.gameCanvasHeight,
// 			12,
// 			3)
// 	}
// 	update()
// 	{
// 		//p1 pos
// 		this.p1.update()
// 		this.p2.update()
// 		this.ball.update()
// 	}
// }
// class Entity extends GameData
// {
// 	width:number
// 	height:number
// 	x:number
// 	y:number
// 	xVec:number = 0
// 	yVec:number = 0
// 	canvasHeight:number
// 	canvasWidth: number
// 	speed:number
// 	constructor()
// 	{
// 		super()
// 		this.width = this.paddleWidth
// 		this.height = h
// 		this.canvasHeight = canvasHeight
// 		this.canvasWidth = canvasWidth
// 		this.speed = speed
// 		this.y = this.canvasHeight / 2 - this.height / 2
// 		this.x = wallOffset
// 		if (type === 2)
// 			this.x = this.canvasWidth - (wallOffset + this.width)
// 		if (type === 3)
// 		{
// 			this.x = this.canvasWidth / 2 - this.width / 2,
// 			this.y = this.canvasHeight / 2 - this.width / 2
// 		}
// 	}
// }

// // class Entity extends GameData
// // {
// // 	width:number
// // 	height:number
// // 	x:number
// // 	y:number
// // 	xVec:number = 0
// // 	yVec:number = 0
// // 	canvasHeight:number
// // 	canvasWidth: number
// // 	speed:number
// // 	constructor(w:number,h:number,wallOffset:number,canvasWidth:number, canvasHeight:number, speed:number, type:number)
// // 	{       
// // 		this.width = w
// // 		this.height = h
// // 		this.canvasHeight = canvasHeight
// // 		this.canvasWidth = canvasWidth
// // 		this.speed = speed
// // 		this.y = this.canvasHeight / 2 - this.height / 2
// // 		this.x = wallOffset
// // 		if (type === 2)
// // 			this.x = this.canvasWidth - (wallOffset + this.width)
// // 		if (type === 3)
// // 		{
// // 			this.x = this.canvasWidth / 2 - this.width / 2,
// // 			this.y = this.canvasHeight / 2 - this.width / 2
// // 		}
// // 	}
// // }

// export class Paddle extends Entity
// {
// 	public 	keysPressed = new Map<string, boolean>()

// 	update()
// 	{
// 		if (this.keysPressed.get("ArrowUp"))
// 		{
// 			this.yVec = -1
// 			if (this.y <= 20)
// 				this.yVec = 0
// 		}
// 		else if (this.keysPressed.get("ArrowDown"))
// 		{
// 			this.yVec = 1
// 			if (this.y + this.height >= this.canvasHeight - 20)
// 				this.yVec = 0
// 		}
//    		else
// 			this.yVec = 0
// 		this.y += this.yVec * this.speed
// 	}
// }

// export class Ball extends Entity
// {
// 	constructor(w:number,h:number,x:number,y:number, canvasheight:number, speed:number, type:number)
// 	{
// 		super(w,h,x,y, canvasheight, speed, type);
// 		var randomDirection = Math.floor(Math.random() * 2) + 1
// 		if (randomDirection % 2)
// 			this.xVec = 1
// 		else
// 			this.xVec = -1
// 		randomDirection = Math.floor(Math.random() * 2) + 1
// 		if (randomDirection % 2)
// 			this.yVec = 1
// 		else
// 			this.yVec = -1
// 	}
// 	update()
// 	{
// 		var randomDirection = Math.floor(Math.random() * 2) + 1

// 		//check top canvas bounds
// 		if (this.y <= 10)
// 		{
// 			//update not just 1 or -1 
// 			this.yVec = 1
// 		}
		
// 		//check bottom canvas bounds
// 		if (this.y + this.height >= this.canvasHeight - 10)
// 		{
// 			//update not just 1 or -1 
// 			this.yVec = -1
// 		}
		
// 		//check left canvas bounds
// 		if (this.x <= 0)
// 		{ 
// 			this.x = this.canvasWidth / 2 - this.width / 2
// 			this.xVec = -1 * this.xVec
// 			if (randomDirection % 2)
// 				this.yVec = 1
// 			else
// 				this.yVec = -1
// 			GameData.player_2_Score += 1
// 			if (GameData.player_2_Score === 11)
// 			{
// 				GameData.gameState.set("game_end", true)
// 				GameData.gameState.set("P2_won", true)
// 			}
// 		}

// 		//check right canvas bounds
// 		if (this.x + this.width >= GameData.gameCanvasWidth)
// 		{
// 			this.x = GameData.gameCanvasWidth / 2 - this.width / 2
// 			this.xVec = -1 * this.xVec
// 			if (randomDirection % 2)
// 				this.yVec = 1
// 			else
// 				this.yVec = -1
// 			GameData.playerScore += 1
// 			if (GameData.playerScore === 11)
// 			{
// 				GameData.gameState.set("game_end", true)
// 				GameData.gameState.set("P1_won", true)
// 			}
// 		}

// 		//check player1 collision
// 		if (this.x <= GameData.player1.x + GameData.player1.width)
// 		{
// 			if (this.y >= GameData.player1.y && this.y + this.height <= GameData.player1.y + GameData.player1.height)
// 			{
// 				this.xVec = 1;
// 				if (this.y > GameData.player1.y)
// 				{
// 					var yvec_amplifier:number = (this.y - GameData.player1.y) / (GameData.player1.height / 2 )
// 					this.yVec = 0.5
// 				}
// 			}
// 		}

// 		//check player2 collision
// 		if (this.x + this.width >= GameData.player2.x)
// 		{
// 			if (this.y >= GameData.player2.y && this.y + this.height <= GameData.player2.y + GameData.player2.height)
// 				this.xVec = -1;
// 		}
// 		this.x += this.xVec * this.speed;
// 		this.y += this.yVec * this.speed;
// 	}
// }

