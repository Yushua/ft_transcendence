import { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { Width } from '../MainWindow/MainWindow';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: `${Width}`,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
    alignContent: 'center',
  };


 
 function FillSpaceComponentAchieve(props: any){
  const [showModal, setShowModal] = useState(-1)

    var widthButton:number = (((Width*0.9) - (Width*0.9*0.03 * props.amount * 2))/props.amount)

   return (
    <>
        <img
            alt=""
            className='image_button'
            key={props.option}         
            style={{ display: "flex", width: `${widthButton}px`, height: `${widthButton}px`, marginLeft:`${Width*0.02}px`,  marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
            onClick={() => setShowModal(props.idx)}
            src={`${props.option.pictureLink}`}
            >
        </img>
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
    </>
   )
}

export default FillSpaceComponentAchieve;
