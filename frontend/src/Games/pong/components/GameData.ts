export class GameData {
	gameState: string
	p1_score: number
	p2_score: number
	p1: Paddle
	p2: Paddle
	ball: Ball

	constructor()
	{
		this.gameState = 'newgame'
		this.p1_score = 0
		this.p2_score = 0
		this.p1 = new Paddle()
		this.p2 = new Paddle()
		this.ball = new Ball()
	}
}

class Entity 
{
	x:number
	y:number
	width:number
	height:number

	draw(context:CanvasRenderingContext2D){
        context.fillStyle = "#fff";
        context.fillRect(this.x,this.y,this.width,this.height);
    }
}

export class Paddle extends Entity {}
export class Ball extends Entity {}