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
}

export class Paddle extends Entity
{
	private speed:number = 12;
}

export class Ball extends Entity
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
}
