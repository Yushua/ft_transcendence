import { Ball, GameData, Paddle } from "../components/GameData"

export default class PracticeModeLoop {
	private static readonly _targetFPS = 60
	private static readonly _targetResponseRateS = 1 / this._targetFPS
	private static readonly _targetResponseRateMS = 1000 / this._targetFPS
	private static readonly _canvasSize = { x: 1500, y: 750 }
	private static readonly _acceleration = .5
	private static readonly _initialSpeed = 10
	
	private static _gamaData: GameData | null = null
	private static _renerGameData: React.Dispatch<React.SetStateAction<GameData>>
	
	static readonly IsRunning = () => !!this._gamaData
	
	static Start(gamaData: GameData, updateMethod: React.Dispatch<React.SetStateAction<GameData>>) {
		if (this.IsRunning())
			return
		
		this._renerGameData = updateMethod
		
		gamaData.ball.width = 20
		gamaData.ball.height = 20
		this.resetBall(gamaData.ball)
		gamaData.p1.height = 100
		gamaData.p1.width = 20
		gamaData.p1.x = 20
		gamaData.p2.height = 100
		gamaData.p2.width = 20
		gamaData.p2.x = this._canvasSize.x - 40
		this.SetMousePosition(0)
		this._gamaData = gamaData
		
		this._startGameLoop(this._targetResponseRateS)
	}
	
	static readonly Stop = () => this._gamaData = null
	
	static SetMousePosition(pos: number) {
		if (!this.IsRunning())
			return
		
		this._gamaData.p1.y = pos - (this._gamaData.p1.height / 2)
		if (this._gamaData.p1.y > this._canvasSize.y - 10 - this._gamaData.p1.height)
			this._gamaData.p1.y = this._canvasSize.y - 10 - this._gamaData.p1.height
		if (this._gamaData.p1.y < 10)
			this._gamaData.p1.y = 10
		this._gamaData.p2.y = this._gamaData.p1.y
	}
	
	private static readonly _startGameLoop = (deltaTime: number) => this._runGameLoop(deltaTime)
	
	private static async _runGameLoop(deltaTime: number) {
		
		if (!this.IsRunning())
			return
		
		const startTime = Date.now()
		
		this._updateGame(this._gamaData.ball, this._gamaData.p1, this._gamaData.p2, deltaTime)
		this._render()
		
		/* Simulate Lag */
		// await new Promise(res => setTimeout(res, Math.random() * 100))
		// await new Promise(res => setTimeout(res, 100))
		
		/* Make sure games update in set intervals */
		const endTime = Date.now()
		var delta = endTime - startTime
		
		/* Print Slowdown */
		// if (delta < 2) {}
		// else if (delta < 5) { console.log(`${"\x1b[37m"}${delta}${"\x1b[0m"}`) }
		// else if (delta < 10) { console.log(`${"\x1b[33m"}${delta}${"\x1b[0m"}`) }
		// else if (delta < 15) { console.log(`${"\x1b[43m"}${delta}${"\x1b[0m"}`) }
		// else if (delta < 20) { console.log(`${"\x1b[31m"}${delta}${"\x1b[0m"}`) }
		// else { console.log(`${"\x1b[41m"}${delta}${"\x1b[0m"}`) }
		
		/* Use fixed framerate to reserve resources */
		if (delta < 20)
			setTimeout(() => this._startGameLoop(this._targetResponseRateS), Math.max(0, this._targetResponseRateMS - delta))
		/* Use delta time to make games playable under heavy or irregular load */
		else
			this._startGameLoop(Math.min(delta / 1000, .10))
	}
	
	private static bounceBallFromPaddle(ball: Ball, xDir: number, p: Paddle) {
		const hit = ball.y + ball.height >= p.y && ball.y <= p.y + p.height
		if (hit) {
			ball["xVec"] = xDir;
			var distance_from_middle = (ball.y + (ball.height / 2)) - (p.y + (p.height / 2))
			ball["yVec"] = distance_from_middle / (p.height / 2)
			ball["speed"] += this._acceleration
		}
		return hit
	}
	
	private static resetBall(ball: Ball) {
		ball.y = this._canvasSize.y / 2 - ball.width / 2
		ball.x = this._canvasSize.x / 2 - ball.height / 2
		ball["yVec"] = Math.random() < .5 ? 1 : -1
		ball["xVec"] = Math.random() < .5 ? 1 : -1
		ball["speed"] = this._initialSpeed
	}
	
	private static _updateGame(ball: Ball, p1:Paddle, p2:Paddle, deltaTime: number)
	{
		//check top canvas bounds
		if (ball.y <= 10) {
			ball.y = 10.1 //so it doesnt loop inside the line
			ball["yVec"] = ball["yVec"] * -1
		}
	
		//check bottom canvas bounds
		if (ball.y + ball.height >= this._canvasSize.y - 10) {
			ball.y = this._canvasSize.y - 10 - ball.height - 0.1 //so it doesnt loop inside the line
			ball["yVec"] = ball["yVec"] * -1
		}
		
		//check left canvas bounds
		if (ball.x <= 10 && !this.bounceBallFromPaddle(ball, 1, p1))
			this.resetBall(ball)
		//check player1 collision
		else if (ball.x <= p1.x + p1.width)
			this.bounceBallFromPaddle(ball, 1, p1)
		
		//check left canvas bounds
		if (ball.x + ball.width >= this._canvasSize.x - 10 && !this.bounceBallFromPaddle(ball, -1, p2))
			this.resetBall(ball)
		//check player1 collision
		else if (ball.x + ball.width >= p2.x)
			this.bounceBallFromPaddle(ball, -1, p2)
		
		var magnatude = Math.sqrt(ball["xVec"]**2 + ball["yVec"]**2) // Used to normalize vector
		var normalizeAndApplyDelta = ball["speed"] * deltaTime * this._targetFPS / magnatude
		ball.x += ball["xVec"] * normalizeAndApplyDelta
		ball.y += ball["yVec"] * normalizeAndApplyDelta
	}
	
	private static _render() {
		const newGameData = new GameData()
		newGameData.ball = this._gamaData.ball
		newGameData.p1 = this._gamaData.p1
		newGameData.p2 = this._gamaData.p2
		this._renerGameData(newGameData)
	}
}
