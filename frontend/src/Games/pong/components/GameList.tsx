import React from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TableContainer from "@mui/material/TableContainer";
import { Socket } from "socket.io-client";
import { withStyles, makeStyles } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Card } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';



function createData_active(id: number, gameName: string, p1: string, p2: string)
{
	return { id, gameName, p1, p2 };
}

function createData_custom(id: number, gameName: string, p1: string, controls:string, BallSpeed: number, PaddleSize:number)
{
	return { id, gameName, p1, controls, BallSpeed, PaddleSize }
}

	
export class GameList extends React.Component<any, any> {

	spectate(gameName:string, socket:Socket)
	{
		if (gameName !== undefined)
			socket.emit('spectate', gameName)
	}

	join(gameName:string, userID:string, userName:string, socket:Socket)
	{
		if (gameName !== undefined)
			socket.emit('joinCustomGame', {gameName, userID, userName})
	}

	setRows(type:string, games:any)
	{
		const rows = []
		let i = 0

		/* public games have max len of 11 chars, private ones have ID that is longer */
		for (var game of games) {
			if (type === 'active' && game[0].length < 12)
				rows[i] = createData_active(i, game[0], game[1][0], game[1][1])
			else if (type === 'custom' && game[0].length < 12)
				rows[i] = createData_custom(i, game[0], game[1][0], game[1][1], game[1][2], game[1][3])
			i++
		}
		return rows
	}

	setRows2(type:string, games:any)
	{
		const rows = []
		let i = 0

		/* public games have max len of 11 chars, private ones have ID that is longer */
		for (var game of games) {
			if (type === 'active' && game[0].length < 12)
				rows[i] = createData_active(i, game[0], game[1][0], game[1][1])
			else if (type === 'custom' && game[0].length < 12)
				rows[i] = createData_custom(i, game[0], game[1][0], game[1][1], game[1][2], game[1][3])
			i++
		}
		return rows
	}
	
	setColumns()
	{
		const columns = []
		let i = 0

		return columns
	}
	  

	render()
	{
		const rows_active = this.setRows('active', this.props.activeGames)
		const rows_custom = this.setRows('custom', this.props.customGames)
		const rows = this.setRows2('custom', this.props.customGames)
		const columns = this.setColumns()
		return (
			<React.Fragment>
				&nbsp;
				<TableContainer
        			component={Paper}
        			style={{ border: "1px solid rgba(0,0,0,0.2)", padding: 40 }}>
				<h3>Active Games</h3>
				<Table size="small">
					<TableHead style={{ width: 30 }}>
						<TableRow>
							<TableCell style={{ width: 1 }}>Player 1</TableCell>
					  		<TableCell style={{ width: 1 }}>Player 2</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
					{rows_active.map((row) => (
						<TableRow key={row.id}>
							<TableCell style={{ width: 30 }}>{row.p1}</TableCell>
							<TableCell style={{ width: 30 }}>{row.p2}</TableCell>
							<TableCell><Button variant="contained" onClick={() => this.spectate(row.gameName, this.props.socket)}>Spectate</Button></TableCell>
						</TableRow>
					))}
					</TableBody>
				</Table>
				<h3>Custom Games</h3>
				<Table size="small"
					padding="checkbox">
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
					{rows_custom.map((row) => (
						<TableRow key={row.id}>
							<TableCell style={{ width: 30 }}>{row.gameName}</TableCell>
							<TableCell style={{ width: 30 }}>{row.p1}</TableCell>
							<TableCell style={{ width: 30 }}>{row.controls}</TableCell>
							<TableCell style={{ width: 30 }}>{row.BallSpeed}</TableCell>
							<TableCell style={{ width: 30 }}>{row.PaddleSize}</TableCell>

							{/* <TableCell>{row.p1}</TableCell>
							<TableCell>{row.controls}</TableCell>
							<TableCell>{row.BallSpeed}</TableCell>
							<TableCell>{row.PaddleSize}</TableCell> */}
							<TableCell><Button variant="contained" onClick={() => this.join(row.gameName, this.props.userID, this.props.userName, this.props.socket)}>Join Game</Button></TableCell>
						</TableRow>
					))}
					</TableBody>
				</Table>
				</TableContainer>
			</React.Fragment>
		)
	}	
}


