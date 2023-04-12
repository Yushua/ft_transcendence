import React from 'react';
import HTTP from '../Utils/HTTP';
import { Box, Modal, Typography } from "@mui/material";

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
  };

async function GetData(id:string){
	let response = HTTP.Get(`gamestats/pongstats/${id}`, null, {Accept: 'application/json'})
	if (response) {
		let games = await JSON.parse(response)
		for (var game of games) {
			response = HTTP.Get(`gamestats/pongstat_timestamp/${game.id}/${id}`, null, {Accept: 'application/json'})
			if (response) {
				game.timestamp = await JSON.parse(response)
			}
		}
		_setList(games)
	}
}

var _setList:React.Dispatch<React.SetStateAction<string[]>>

function GameDataBar(props: any) {
  	//get into page, get the entire list online
	const [gameList, setList] = React.useState<any[]>([]);
	const [showModal, setShowModal] = React.useState(-1)
	const width = props.width
	const widthButton = ((width*0.9) - (width*0.9*0.03 * 3 * 2))/3
	_setList = setList

	React.useEffect(() => {
		GetData(props.id)
	}, [])

	return (
		<div>
			{gameList.map((option, idx) => (
				<div key={option.id}>
					<button
						style={{ display: "inline-block", width: `${widthButton}px`, height: `${widthButton}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`}}
						onClick={() => setShowModal(idx)}>
						<img src={`${HTTP.HostRedirect()}pfp/${option.pictureLink}`} alt="" style={{width: `${widthButton - width*0.03}px`, height: `${widthButton - width*0.03}px`, border: "4px solid black"}}/>
					</button>
					<Modal
						open={showModal === idx}
						onClose={() => setShowModal(-1)}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								{option.nameGame} played at {option.timestamp}
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Winner: {option.winner} ({option.scoreWinner}) Loser: {option.loser} ({option.scoreLoser}) 
							</Typography>
						</Box>
					</Modal>
				</div>	
			))}
		</div>
	)
}

export default GameDataBar;
