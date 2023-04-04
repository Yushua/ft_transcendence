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

function createData_active(id: number, gameName: string, displayName:string, p1: string, p2: string)
{
	return { id, gameName, displayName, p1, p2 };
}

export default class SpectateTab extends React.Component<any, any> {

	spectate(gameName:string, socket:Socket)
	{
		if (gameName !== undefined) {
			socket.emit('spectate', gameName)
		}
	}

	setRows(gamesList:Map<string, string[]>)
	{
		const rows = []
		let i = 0
		console.log('info:', gamesList)
		/* public games have max len of 12 chars, private ones have ID that is longer */
		/* game is map with key = gamename and value = string of data: p1_name, p2_name (+custom stuff if set) */
		/* for active games, third value of value ([1][2]) is bool that is true if game is a classic game */
		for (var game of gamesList) {
			if (game[1][2]) {
				rows[i] = createData_active(i, game[0], 'Classic', game[1][0], game[1][1])
			}
			else if (game[0].length < 15)
				rows[i] = createData_active(i, game[0], game[0], game[1][0], game[1][1])
			i++
		}
		return rows
	}	  

	render()
	{
		const rows_active = this.setRows(this.props.activeGames)
		return (
			<center>
				&nbsp;
				<TableContainer
        			component={Paper}
        			style={{ width: "100%", border: "1px solid rgba(0,0,1,0.2)" }}>
					{rows_active.length === 0 ? <h3 style={{color: "#3355FF"}}>No Active Games</h3> : 
						<Table padding="checkbox" size="small">
							<TableHead >
								<TableRow >
									<TableCell style={{color: "#3368FF"}}>Game Name</TableCell>
									<TableCell style={{width: 70, color: "#3368FF"}}>Player 1</TableCell>
									<TableCell style={{width: 70, color: "#3368FF"}}>Player 2</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
							{rows_active.map((row) => (
								<TableRow key={row.id}>
									<TableCell style={{width: 85, color: "#FF3333"}}>{row.displayName}</TableCell>
									<TableCell style={{width: 50, color: "#FF3333"}}>{row.p1}</TableCell>
									<TableCell style={{width: 50, color: "#FF3333"}}>{row.p2}</TableCell>
									<TableCell><Button variant="contained" onClick={() => this.spectate(row.gameName, this.props.socket)}>Spectate</Button></TableCell>
								</TableRow>
							))}
							</TableBody>
						</Table> }
				</TableContainer>
			</center>
		)
	}	
}
