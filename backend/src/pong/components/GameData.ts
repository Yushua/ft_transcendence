import { normalize } from "path"
import { targetFPS } from "../utils/gateway.controller"

export class GameData {
	gameName:string
	gameState: string
	p1_score: number
	p2_score: number
	p1: Paddle
	p2: Paddle
	ball: Ball
	p1_name: string
	p2_name: string
	p1_controls:string
	p2_controls:string
	ballSpeed:number
	paddleSize:number
	isClassic:boolean

	constructor(Config:any, isClassic:boolean)
	{
		this.gameName = Config.gameName
		this.p1_name = Config.p1_name
		this.p2_name = Config.p2_name
		this.gameState = 'newgame'
		this.p1_score = 0
		this.p2_score = 0
		this.p1_controls = Config.p1_controls
		this.p2_controls = Config.p2_controls
		this.ballSpeed = Config.ballSpeed
		this.paddleSize = Config.paddleSize
		this.p1 = new Paddle(12, 1, 1500, 750, 20, 20, Config.paddleSize)
		this.p2 = new Paddle(12, 2, 1500, 750, 20, 20, Config.paddleSize)
		this.ball = new Ball(10 * Config.ballSpeed / 100, 3, 1500, 750, 20, 20, 20)
		this.isClassic = isClassic
	}

	update(deltaTime: number)
	{
		switch (this.ball.update(this.p1, this.p2, deltaTime)) {
			case 'p1_scored':
				this.p1_score++
				if (this.p1_score === 11)
					this.gameState = 'p1_won'
				break;
			
			case 'p2_scored':
				this.p2_score++
				if (this.p2_score === 11)
					this.gameState = 'p2_won'
				break;
		
			default: break;
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
		this.y = position - (this.height / 2) - 80
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
		this.yVec = Math.random() < .5 ? 1 : -1
		this.xVec = Math.random() < .5 ? 1 : -1
		this.startDir = this.xVec
	}
	
	bounceBallFromPaddle(xDir: number, p: Paddle) {
		const hit = this.y + this.height >= p.y && this.y <= p.y + p.height
		if (hit) {
			this.xVec = xDir;
			var distance_from_middle = (this.y + (this.height / 2)) - (p.y + (p.height / 2))
			this.yVec = distance_from_middle / (p.height / 2)
			this.speed += this.acceleration
		}
		return hit
	}
	
	resetBall() {
		this.y = this.gameCanvasHeight / 2 - this.width / 2
		this.x = this.gameCanvasWidth / 2 - this.height / 2
		this.yVec = Math.random() < .5 ? 1 : -1
		this.xVec = -1 * this.startDir
		this.startDir = this.xVec
		this.speed = this.initialSpeed
	}
	
	update(p1:Paddle, p2:Paddle, deltaTime: number)
	{
		//check top canvas bounds
		if (this.y <= 10) {
			this.y = 10.1 //so it doesnt loop inside the line
			this.yVec = this.yVec * -1
		}
	
		//check bottom canvas bounds
		if (this.y + this.height >= this.gameCanvasHeight - 10) {
			this.y = this.gameCanvasHeight - 10 - this.height - 0.1 //so it doesnt loop inside the line
			this.yVec = this.yVec * -1
		}
		
		//check left canvas bounds
		if (this.x <= 10 && !this.bounceBallFromPaddle(1, p1)) { 
			this.resetBall()
			return 'p2_scored'
		}
		//check player1 collision
		else if (this.x <= p1.x + p1.width)
			this.bounceBallFromPaddle(1, p1)
		
		//check right canvas bounds
		if (this.x + this.width >= this.gameCanvasWidth - 10 && !this.bounceBallFromPaddle(-1, p2)) {
			this.resetBall()
			return 'p1_scored'
		}
		//check player2 collision
		else if (this.x + this.width >= p2.x)
			this.bounceBallFromPaddle(-1, p2)
		
		var magnatude = Math.sqrt(this.xVec**2 + this.yVec**2) // Used to normalize vector
		var normalizeAndApplyDelta = this.speed * deltaTime * targetFPS / magnatude
		this.x += this.xVec * normalizeAndApplyDelta
		this.y += this.yVec * normalizeAndApplyDelta
	}
}
