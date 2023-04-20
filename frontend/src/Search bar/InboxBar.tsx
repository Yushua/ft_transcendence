import React, { useState } from 'react';
import HTTP from '../Utils/HTTP';
import { Width } from '../MainWindow/MainWindow';
import { Box, Modal, Typography } from '@mui/material';

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
  fontFamily: "'Courier New', monospace",
  fontSize: "150%"
  };

export async function asyncAchievmentList(id:string){
  const response = HTTP.Get(`user-profile/GetMessageList`, null, {Accept: 'application/json'})
  if (response) {
		let messages = await JSON.parse(response)
		_setList(messages)
	}
}

export async function asyncRemoveMessage(id:string){
  HTTP.Post(`user-profile/removemessage/${id}`, null, {Accept: 'application/json'})
}
async function getList(id:string){
  await asyncAchievmentList(id)
}

async function removeMessage(id:string){
  await asyncRemoveMessage(id)
  _setDisplay(false)
}


var _setList:React.Dispatch<React.SetStateAction<string[][]>>

/*
  get message if you get an
  - achievement
  - a friend gets one

  maybe
  - only when you have them set up, you need to follow them to have this option, so only in unfollow
  - 
*/

var _setDisplay:React.Dispatch<React.SetStateAction<boolean>>

function InboxBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<any[]>([]);
  const [Display, setDisplay] = useState<boolean>(false);
  const [showModal, setShowModal] = React.useState(-1)
  _setList = setList
  _setDisplay = setDisplay
  if (Display === false){
    getList(props.id)
    setDisplay(true)
  }
  var boxwidth:number = props.width*0.9
  var buttonsize:number = ((Width*0.9) - (Width*0.9*0.03 * 6 * 2))/7
  var border:number = Width*0.005
  const handleButtonClick = (e: string) => {
    setShowModal(-1)
    removeMessage(e)
  };
  {/* object around then text, then button*/}
    return (
        < >

          {ListSearchList.map((option, index) => (
            <>
                <div
                  className='image_button'
                  key={index}
                  onClick={() => setShowModal(index)}
                  style={{display: 'flex', overflow: "hidden", textOverflow: `ellipsis`, alignItems: 'center', justifyContent: "center", minWidth: `${boxwidth}px`, width: `${boxwidth}px`, height: `${buttonsize - (border*2)}px`, marginLeft:`${props.width*0.02}px` , marginRight: `${props.width*0.02}px`}}
                  >
                    <h2>{option.message}</h2>
                </div>
                <Modal
                  open={showModal === index}
                  onClose={() => setShowModal(-1)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  >
                    <center>
                      <Box sx={style}>
                      <Typography id="modal-modal-title" component="h2">
                          {option.message}
                      </Typography>
                        <div
                            className='image_button'
                            style={{ alignItems: 'center', justifyContent: "center", display: 'flex', width: `${buttonsize}px`, height: `${buttonsize/2}px`}}
                            onClick={() => handleButtonClick(option.id)}
                          >
                              <div>remove</div>
                        </div>
                      </Box>
                    </center>
                </Modal>
            </>
          ))}
        </>
    )
}

export default InboxBar;