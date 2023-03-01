import React from "react"

export class GameList extends React.Component<any, any> {

	getGames(list:string[])
	{
		
	}

	render()
	{
		this.getGames(this.props.list)
		console.log('props', this.props)
		return (
			<h4>
				LIST
				{this.props.list[0]}
			</h4>
		)
	}
}
