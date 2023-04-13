import React, { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { Width } from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';

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
  alignContent: 'center',
  };

 //get into page, get the entire list online
 
 function FillSpaceComponentAchieve(props: any){
  const [showModal, setShowModal] = React.useState(-1)
 
 var widthButton:number = (((Width*0.9) - (Width*0.9*0.03 * props.amount * 2))/props.amount)

   return (
    <div>
        <div key={props.option.id} style={{display: "inline-block"}}>
        <button
            key={props.option}
            style={{ width: `${widthButton}px`, height: `${widthButton}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
            onClick={() => setShowModal(props.idx)}>
            <img src={`${HTTP.HostRedirect()}pfp/${props.option.pictureLink}`} alt="" style={{width: `${widthButton - Width*0.03}px`, height: `${widthButton - Width*0.03}px`, border: "4px solid black"}}/>
        </button>
        <Modal
            open={showModal === props.idx}
            onClose={() => setShowModal(-1)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
            <Typography id="modal-modal-title" component="h2">
                {props.option.nameAchievement}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {props.option.message}
            </Typography>
            </Box>
        </Modal>
        </div>
    </div>
   )
}

export default FillSpaceComponentAchieve;
