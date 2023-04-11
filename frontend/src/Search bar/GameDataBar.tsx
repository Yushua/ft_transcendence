import React, { useEffect, useState } from 'react';
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
		let result = []
		let i = 0
		for (var game of games) {
			response = HTTP.Get(`gamestats/pongstat_timestamp/${game.id}/${id}`, null, {Accept: 'application/json'})
			if (response) {
				console.log('response:', response)
				let timestamp = await JSON.parse(response)
				result[i] = [game, timestamp]
				i++
			}
		}
		console.log('result:', result)
		console.log('games:', games)
		_setList(result)
	}
}


var _setList:React.Dispatch<React.SetStateAction<string[]>>
// var _setTimeStamp:React.Dispatch<React.SetStateAction<Date>>


function GameDataBar(props: any) {
  //get into page, get the entire list online
	const [gameList, setList] = React.useState<any[]>([]);
	const [showModal, setShowModal] = React.useState(false)
	// const [timeStamp, setTimeStamp] = React.useState<Date[]>(now)

	_setList = setList
	// _setTimeStamp = setTimeStamp

	const width = props.width
	const widthButton = ((width*0.9) - (width*0.9*0.03 * 3 * 2))/3

	React.useEffect(() => {
		GetData(props.id)
	}, [])

	function toggleModal() {
		setShowModal(!showModal)
	}

	return (
		<div>
			{gameList.map((option) => (
				<div key={option[0].id}>
					<button
						style={{ display: "inline-block", width: `${widthButton}px`, height: `${widthButton}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`}}
						onClick={() => toggleModal()}>
						<img src={`${HTTP.HostRedirect()}pfp/${option.pictureLink}`} alt="" style={{width: `${widthButton - width*0.03}px`, height: `${widthButton - width*0.03}px`, border: "4px solid black"}}/>
					</button>
					<Modal
					open={showModal}
					onClose={toggleModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box  sx={style}>
						<Typography id="modal-modal-title" variant="h6" component="h2">
							{option[0].nameGame} played at {option[1]}
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							Winner: {option[0].winner} ({option[0].scoreWinner}) Loser: {option[0].loser} ({option[0].scoreWinner}) 
						</Typography>
					</Box>
				</Modal>
			</div>	
			
			))}

		</div>
	)
}

export default GameDataBar;

// onClick={() => handleButtonClick(option)}>
