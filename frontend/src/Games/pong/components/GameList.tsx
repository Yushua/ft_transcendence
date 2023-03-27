import React from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TableContainer from "@mui/material/TableContainer";
import { Socket } from "socket.io-client";
import Paper from "@mui/material/Paper";

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

		/* public games have max len of 12 chars, private ones have ID that is longer */
		for (var game of games) {
			if (type === 'active' && game[0].length < 13)
			{
				if (game[1][2])
					rows[i] = createData_active(i, 'Classic', game[1][0], game[1][1])
				else
					rows[i] = createData_active(i, game[0], game[1][0], game[1][1])
			}
			else if (type === 'custom' && game[0].length < 13)
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
		return (
			<React.Fragment>
				&nbsp;
				<TableContainer
        			component={Paper}
        			style={{ border: "1px solid rgba(0,0,1,0.2)", padding: 40 }}>
				{rows_active.length === 0 ? <h3 style={{color: "#3355FF"}}>No Active Games</h3> : 
				<div>
					<h3 style={{color: "#3355FF"}}>Active Games</h3>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell style={{width: 120, color: "#3368FF"}}>Game Name</TableCell>
								<TableCell style={{width: 70, color: "#3368FF"}}>Player 1</TableCell>
								<TableCell style={{width: 70, color: "#3368FF"}}>Player 2</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{rows_active.map((row) => (
							<TableRow key={row.id}>
								<TableCell style={{width: 85, color: "#FF3333"}}>{row.gameName}</TableCell>
								<TableCell style={{width: 50, color: "#FF3333"}}>{row.p1}</TableCell>
								<TableCell style={{width: 50, color: "#FF3333"}}>{row.p2}</TableCell>
								<TableCell><Button variant="contained" onClick={() => this.spectate(row.gameName, this.props.socket)}>Spectate</Button></TableCell>
							</TableRow>
						))}
						</TableBody>
					</Table>
				</div> }
				{rows_custom.length === 0 ? <h3 style={{color: "#3355FF"}}>No Custom Games</h3> : 
				<div>
					<h3 style={{color: "#3355FF"}}>Custom Games</h3>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell style={{color: "#3368FF"}}>Game Name</TableCell>
								<TableCell style={{color: "#3368FF"}}>Creator</TableCell>
								<TableCell style={{color: "#3368FF"}}>Controls</TableCell>
								<TableCell style={{width: 70, color: "#3368FF"}}>Ball Speed</TableCell>
								<TableCell style={{width: 80, color: "#3368FF"}}>Paddle Size</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{rows_custom.map((row) => (
							<TableRow key={row.id}>
								<TableCell style={{width: 120, color: "#FF3333"}}>{row.gameName}</TableCell>
								<TableCell style={{width: 50, color: "#FF3333"}}>{row.p1}</TableCell>
								<TableCell style={{width: 50, color: "#FF3333"}}>{row.controls}</TableCell>
								<TableCell style={{width: 50, color: "#FF3333"}}>{row.BallSpeed}</TableCell>
								<TableCell style={{width: 50, color: "#FF3333"}}>{row.PaddleSize}</TableCell>
								<TableCell><Button variant="contained" onClick={() => this.join(row.gameName, this.props.userID, this.props.userName, this.props.socket)}>Join Game</Button></TableCell>
							</TableRow>
						))}
						</TableBody>
					</Table>
				</div>}
				</TableContainer>
			</React.Fragment>
		)
	}	
}
