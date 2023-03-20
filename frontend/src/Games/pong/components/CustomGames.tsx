import React from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { Socket } from "socket.io-client";

export class CustomGames {
	gameName:string
	p1:string
	controls:string
	BallSpeed:number
	PaddleSize:number
	constructor()
	{
		this.gameName = ''
		this.p1 = ''
		this.controls = ''
		this.PaddleSize = 100
		this.BallSpeed = 100
	}
}

function createData(id: number, gameName: string, p1: string, controls:string, BallSpeed: number, PaddleSize:number)
{
	return { id, gameName, p1, controls, BallSpeed, PaddleSize }
}

export class CustomGameList extends React.Component<any, any> {

	join(gameName:string, socket:Socket)
	{
		if (gameName !== undefined)
			socket.emit('spectate', gameName)
	}

	setRows(customGames:Map<string, any[]>)
	{
	
		const rows = []
		let i = 0
		for (var customGame of customGames) {
			rows[i] = createData(i, customGame[0], customGame[1][0], customGame[1][1], customGame[1][2], customGame[1][3])
			i++
		}
		return rows
	}

	render()
	{
		console.log('props:', this.props)
		const rows = this.setRows(this.props.customGames)
		return (
			<React.Fragment>
			<h3>Custom Games</h3>
			<Table size="small">
			  <TableHead>
				<TableRow>
				  <TableCell>Game Name</TableCell>
				  <TableCell>Creator</TableCell>
				  <TableCell>Controls</TableCell>
				  <TableCell>Ball Speed</TableCell>
				  <TableCell>Paddle Size</TableCell>
				</TableRow>
			  </TableHead>
			  <TableBody>
				{rows.map((row) => (
				  <TableRow key={row.id}>
					<TableCell>{row.gameName}</TableCell>
					<TableCell>{row.p1}</TableCell>
					<TableCell>{row.controls}</TableCell>
					<TableCell>{row.BallSpeed}</TableCell>
					<TableCell>{row.PaddleSize}</TableCell>
					<TableCell><Button onClick={() => this.join(row.gameName, this.props.socket)}>Join Game</Button></TableCell>
				  </TableRow>
				))}
			  </TableBody>
			</Table>
		  </React.Fragment>
		)
	  
	}	
}