import React from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { Socket } from "socket.io-client";

function createData(id: number, gameName: string, p1: string, p2: string)
{
	return { id, gameName, p1, p2 };
}

export class GameList extends React.Component<any, any> {

	spectate(gameName:string, socket:Socket)
	{
		if (gameName !== undefined)
			socket.emit('spectate', gameName)
	}

	setRows(listmap:Map<string, string[]>)
	{
		const rows = []
		let i = 0
		for (var list of listmap) {
			rows[i] = createData(i, list[0], list[1][0], list[1][1])
			i++
		}
		return rows
	}

	render()
	{
		const rows = this.setRows(this.props.listmap)
		return (
			<React.Fragment>
			<h3>Active Games</h3>
			<Table size="small">
			  <TableHead>
				<TableRow>
				  <TableCell>Game Name</TableCell>
				  <TableCell>Player 1</TableCell>
				  <TableCell>Player 2</TableCell>
				</TableRow>
			  </TableHead>
			  <TableBody>
				{rows.map((row) => (
				  <TableRow key={row.id}>
					<TableCell>{row.gameName}</TableCell>
					<TableCell>{row.p1}</TableCell>
					<TableCell>{row.p2}</TableCell>
					<TableCell><Button variant="contained" onClick={() => this.spectate(row.gameName, this.props.socket)}>Spectate</Button></TableCell>
				  </TableRow>
				))}
			  </TableBody>
			</Table>
		  </React.Fragment>
		)
	  
	}	
}