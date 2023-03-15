import { normalize } from "path"

export class GameData {
	gameName:string
	gameState: string
	p1_score: number
	p2_score: number
	p1: Paddle
	p2: Paddle
	ball: Ball

	constructor(gamename:string, speedpercent:number, paddleSizePercent:number)
	{
		this.gameName = gamename
		this.gameState = 'newgame'
		this.p1_score = 0
		this.p2_score = 0
		this.p1 = new Paddle(12, 1, 1500, 750, 20, 20, paddleSizePercent)
		this.p2 = new Paddle(12, 2, 1500, 750, 20, 20, paddleSizePercent)
		this.ball = new Ball(10 * speedpercent / 100, 3, 1500, 750, 20, 20, 20)
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
				this.gameState = 'p2_won'
		}
	}
}

class Entity 
{
	x:number
	y:number
	xVec:number
	yVec:number
	speed:number
	initialSpeed:number
	acceleration = .5
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
		this.initialSpeed = speed
		this.gameCanvasWidth = gameCanvasWidth
		this.gameCanvasHeight = gameCanvasHeight
		this.wallOffset = wallOffset
		this.speed = this.initialSpeed
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
	update_kb(direction:number)
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
		this.y += this.yVec * (this.speed / 2)
	}
	update_mouse(position:number)
	{
		this.y = position
		if (this.y > this.gameCanvasHeight - 10 - this.height)
			this.y = this.gameCanvasHeight - 10 - this.height
		if (this.y < 10)
			this.y = 10
	}
}

export class Ball extends Entity
{
	private startDir:number

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
		this.startDir = this.xVec
	}
	update(p1:Paddle, p2:Paddle)
	{
		var randomDirection = Math.floor(Math.random() * 2) + 1

		//check top canvas bounds
		if (this.y <= 10)
		{
			this.y = 10.1 //so it doesnt loop inside the line
			this.yVec = this.yVec * -1
		}
	
		//check bottom canvas bounds
		if (this.y + this.height >= this.gameCanvasHeight - 10)
		{
			this.y = this.gameCanvasHeight - 10 - this.height - 0.1 //so it doesnt loop inside the line
			this.yVec = this.yVec * -1
		}
	
		//check left canvas bounds
		if (this.x <= 10)
		{ 
			this.x = this.gameCanvasWidth / 2 - this.height / 2
			this.y = this.gameCanvasHeight / 2 - this.width / 2
			this.xVec = -1 * this.startDir
			this.startDir = this.xVec
			if (randomDirection % 2)
				this.yVec = 1
			else
				this.yVec = -1
			this.speed = this.initialSpeed
			return 'p2_scored'
		}

		//check right canvas bounds
		if (this.x + this.width >= this.gameCanvasWidth - 10)
		{
			this.x = this.gameCanvasWidth / 2 - this.height / 2
			this.y = this.gameCanvasHeight / 2 - this.width / 2
			this.xVec = -1 * this.startDir
			this.startDir = this.xVec
			if (randomDirection % 2)
				this.yVec = 1
			else
				this.yVec = -1
			this.speed = this.initialSpeed
			return 'p1_scored'
		}

		//check player1 collision
		if (this.x <= p1.x + p1.width)
		{
			if (this.y + this.height >= p1.y && this.y <= p1.y + p1.height)
			{
				this.xVec = 1;
				if (this.y + (this.height / 2) < p1.y + (p1.height / 2)) //above the middle
				{
					var distance_from_middle = p1.y + (p1.height / 2) - (this.y + (this.height / 2))
					var percentage_from_middle = distance_from_middle / (p1.height / 2)
					this.yVec = -1 * percentage_from_middle
				}
				else if (this.y > p1.y + (p1.height / 2))
				{
					var distance_from_middle = (this.y + (this.height / 2)) - (p1.y + (p1.height / 2))
					var percentage_from_middle = distance_from_middle / (p1.height / 2)
					this.yVec = 1 * percentage_from_middle
				}
				else
					this.yVec = 0
				this.speed += this.acceleration
			}
		}

		//check player2 collision
		if (this.x + this.width >= p2.x)
		{
			if (this.y + this.height >= p2.y && this.y <= p2.y + p2.height)
			{
				this.xVec = -1;
				if (this.y + (this.height / 2) < p2.y + (p2.height / 2)) //above the middle
				{
					var distance_from_middle = p2.y + (p2.height / 2) - (this.y + (this.height / 2))
					var percentage_from_middle = distance_from_middle / (p2.height / 2)
					this.yVec = -1 * percentage_from_middle
				}
				else if (this.y > p2.y + (p2.height / 2))
				{
					var distance_from_middle = (this.y + (this.height / 2))- (p2.y + (p2.height / 2))
					var percentage_from_middle = distance_from_middle / (p2.height / 2)
					this.yVec = 1 * percentage_from_middle
				}
				else
					this.yVec = 0
				this.speed += this.acceleration
			}
		}
		var magnatude = Math.sqrt(this.xVec**2 + this.yVec**2) // Used to normalize vector
		this.x += (this.xVec) / magnatude * this.speed
		this.y += (this.yVec) / magnatude * this.speed
		return ''
	}
}
