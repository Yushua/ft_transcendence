import React from "react"

class Scores extends React.Component<any, any> {


	constructor(props:any)
	{
		super(props)
	}
	draw()
	{

	}
	render()
	{
		return (<></>)
	}
}

export class RenderScores extends React.Component<any, any> {
	render()
	{
		return (
			<div>
				<Scores props={this.props} />
			</div>
		)
	}

}
