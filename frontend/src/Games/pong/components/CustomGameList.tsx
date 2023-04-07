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

function createData(id: number, gameName: string, p1: string, controls:string, BallSpeed: number, PaddleSize:number)
{
	return { id, gameName, p1, controls, BallSpeed, PaddleSize }
}

	
export class CustomGameList extends React.Component<any, any> {

	join(gameName:string, userID:string, userName:string, socket:Socket)
	{
		if (gameName !== undefined)
			socket.emit('joinCustomGame', {gameName, userID, userName})
	}

	setRows(games:any)
	{
		const rows = []
		let i = 0

		/* public games have max len of 12 chars, private ones have ID that is longer */
		/* game is map with key = gamename and value = string of data: p1_name, p2_name (+custom stuff if set) */
		/* for active games, third value of value ([1][2]) is bool that is true if game is a classic game */
		for (var game of games) {
			if (game[0].length < 13)
				rows[i] = createData(i, game[0], game[1][0], game[1][1], game[1][2], game[1][3])
			i++
		}
		return rows
	}	  

	render()
	{
		const rows = this.setRows(this.props.customGames)
		return (
			<React.Fragment>
				&nbsp;
				<TableContainer
        			component={Paper}
        			style={{ width:"100%", justifyContent:"center", border: "1px solid rgba(0,0,1,0.2)" }}>
				{rows.length === 0 ? <h3 style={{color: "#3355FF"}}>No Custom Games</h3> : 
				<div>
					<h3 style={{color: "#3355FF"}}>Custom Games</h3>
					<Table  style={{tableLayout: "fixed"}} size="small">
						<TableHead>
							<TableRow >
								<TableCell style={{color: "#3368FF"}}>Game</TableCell>
								<TableCell style={{color: "#3368FF"}}>Creator</TableCell>
								<TableCell style={{color: "#3368FF"}}>Controls</TableCell>
								<TableCell style={{color: "#3368FF"}}>Ball Speed</TableCell>
								<TableCell style={{color: "#3368FF"}}>Paddle Size</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{rows.map((row) => (
							<TableRow key={row.id}>
								<TableCell style={{color: "#FF3333"}}>{row.gameName}</TableCell>
								<TableCell style={{color: "#FF3333"}}>{row.p1}</TableCell>
								<TableCell style={{color: "#FF3333"}}>{row.controls}</TableCell>
								<TableCell style={{color: "#FF3333"}}>{row.BallSpeed}</TableCell>
								<TableCell style={{color: "#FF3333"}}>{row.PaddleSize}</TableCell>
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
