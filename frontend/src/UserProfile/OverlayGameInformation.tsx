import styled from "@emotion/styled";
import React, { Component } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
// import "react-overlays/Modal/dist/index.css";


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
  
const OverlayGameData = (props) => {
	{/* 
	because gamedata can be different, CAN BE, depending on what game. ehre you can setup a default path,
	meaning if you have a specicfic name, you can say "if this, do this, else default system"
	*/}

	const [showModal, setShowModal] = React.useState(false)

	function toggleModal() {
		setShowModal(!showModal)
	}

	return (
	<div>
		<Button onClick={(toggleModal)}>Open modal</Button>
		<Modal
			open={showModal}
			onClose={toggleModal}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
		<Box sx={style}>
			<Typography id="modal-modal-title" variant="h6" component="h2">
				Text in a modal
			</Typography>
			<Typography id="modal-modal-description" sx={{ mt: 2 }}>
				game stats
			</Typography>
		</Box>
		</Modal>
	</div>
)}

export default OverlayGameData;