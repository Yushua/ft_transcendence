export class Config {
	gameName:string
	p1_name:string
	p2_name:string
	p1_controls:string
	p2_controls:string
	p1_userID:string
	p2_userID:string
	paddleSize:number
	ballSpeed:number
	constructor() {
		this.gameName = 'gameName'
		this.p1_name = ''
		this.p2_name = ''
		this.p1_controls = 'mouse'
		this.p2_controls = 'mouse'
		this.p1_userID = ''
		this.p2_userID = ''
		this.ballSpeed = 100
		this.paddleSize = 100
	}
}

export default Config