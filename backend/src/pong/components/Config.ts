type Config = {
	gameName:string,
	p1_name:string,
	p2_name:string,
	p1_controls:string,
	p2_controls:string,
	p1_userID:string,
	p2_userID:string,
	paddleSize:number,
	ballSpeed:number
}

let DefaultConfig:Config = {
	gameName: '',
	p1_name: '',
	p2_name: '',
	p1_controls: 'mouse',
	p2_controls:'mouse',
	p1_userID: '',
	p2_userID: '',
	paddleSize:100,
	ballSpeed:100
}

export default DefaultConfig