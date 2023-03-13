export class GameData {
	gameState: string
	gameNum: number
	gameName: string
	p1_score: number
	p2_score: number
	p1: Paddle
	p2: Paddle
	ball: Ball
	p1_name: string
	p2_name: string

	constructor(num:number, gamename:string, p1name:string, p2name:string)
	{
		this.gameState = 'newgame'
		this.p1_score = 0
		this.p2_score = 0
		this.gameNum = num
		this.p1 = new Paddle(12, 1, 1500, 750, 20, 20, 100)
		this.p2 = new Paddle(12, 2, 1500, 750, 20, 20, 100)
		this.ball = new Ball(6, 3, 1500, 750, 20, 20, 20)
		this.gameName = gamename
		this.p1_name = p1name
		this.p2_name = p2name
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
}