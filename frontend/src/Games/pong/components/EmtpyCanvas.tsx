import React from "react"

export class EmptyCanvas extends React.Component<any, any> {

	private	gameCanvas

	constructor(props:any)
	{
		super(props)
		this.gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
		this.gameCanvas.width = 0
		this.gameCanvas.height = 0
	}
	render()
	{
		return (<></>)
	}
}