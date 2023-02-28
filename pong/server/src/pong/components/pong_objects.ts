export class GameData {
	// gameState = new Map<string, boolean>()
	gameState: string
	gameNum: number
	p1_score: number
	p2_score: number
	p1: Paddle
	p2: Paddle
	ball: Ball


	constructor(num:number)
	{
		this.gameState = 'newgame'
		this.p1_score = 0
		this.p2_score = 0
		this.gameNum = num
		this.p1 = new Paddle(12, 1, 1500, 750, 20, 20, 100)
		this.p2 = new Paddle(12, 2, 1500, 750, 20, 20, 100)
		this.ball = new Ball(1, 3, 1500, 750, 20, 20, 20)
	}

	update(event:string)
	{
		if (event === 'p1_scored')
		{
			this.p1_score++
			if (this.p1_score === 11)
				this.gameState = 'p1_won'
		}
		else if (event === 'p2_scored')
		{
			this.p2_score++
			if (this.p2_score === 11)
			{
				this.gameState = 'p2_won'
			}
		}
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
	draw(context:CanvasRenderingContext2D){
        context.fillStyle = "#fff";
        context.fillRect(this.x,this.y,this.width,this.height);
    }
}

export class Paddle extends Entity
{
	public 	keysPressed = new Map<string, boolean>()

	update(direction:number)
	{
		if (direction === 1)
		{
			this.yVec = -1
			if (this.y <= 20)
				this.yVec = 0
		}
		else if (direction === -1)
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
			return 'p2_scored'
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
			return 'p1_scored'
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
		return ''
	}
}


