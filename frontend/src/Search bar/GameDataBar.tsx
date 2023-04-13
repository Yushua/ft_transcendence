import { useState, useEffect } from 'react';
import HTTP from '../Utils/HTTP';
import { Box, Modal, Typography } from "@mui/material";
import { Width } from '../MainWindow/MainWindow'
import { Moment} from 'moment';


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
}

async function GetData(id:string){
	let response = HTTP.Get(`gamestats/pongstats/${id}`, null, {Accept: 'application/json'})
	if (response) {
		let games = await JSON.parse(response)
		_setList(games)
	}
}

var _setList:React.Dispatch<React.SetStateAction<string[]>>

function GameDataBar(props: any) {
  	//get into page, get the entire list online
	const [gameList, setList] = useState<any[]>([]);
	const [showModal, setShowModal] = useState(-1)
	_setList = setList

    const widthButton:number = (((Width*0.9) - (Width*0.9*0.03 * 6 * 2))/6)

	useEffect(() => {
		GetData(props.id)
	}, [])

	function gameDayHour(time:Date) {


		let day = time.getDay()

		return ( day) 
	}
	function gameStart(time:Date) {
		let day = time.getDay()
		
		return ( day) 
	}
	function gameEnd(time:Date) {

		let day = time.getDay()
		
		return ( day) 
	}

	return (
		<div>
			{gameList.map((option, idx) => (
				<div key={option.id} style={{display: "inline-block"}}>
					<img
						className='image_button'
						src={`https://styles.redditmedia.com/t5_2sx6x/styles/communityIcon_acwnxauia1p01.png`}
						alt=""
						style={{ display: "inline-block", width: `${widthButton}px`, height: `${widthButton}px`, marginLeft:`${Width*0.02}px`,  marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
						onClick={() => setShowModal(idx)} >
					</img>
					<Modal
						open={showModal === idx}
						onClose={() => setShowModal(-1)}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style}>
							<Typography id="modal-modal-title" component="h2">
								{option.timeStamp}
								{/* Played at: {gameDayHour(option.timestamp)}
								From {gameStart(option.timestamp)} to {gameEnd(option.timestamp)} */}
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
