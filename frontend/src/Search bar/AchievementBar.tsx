import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
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
  };

export async function asyncAchievmentList(id:string){
  const response = HTTP.Get(`user-profile/GetAchievementListDone/${id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
}

async function getList(id:string){
  await asyncAchievmentList(id)
  // const myArr = Object.values(myObj).map(val => val * 2);
}

var _setList:React.Dispatch<React.SetStateAction<string[]>>

type Props = {
  width:number;
  height:number;
  id:string
}

function AchievementBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<any[]>([]);
  const [width, setwidth] = useState<number>(props.width);
  const [widthButton, setwidthButton] = useState<number>(((width*0.9) - (width*0.9*0.03 * 3 * 2))/3);

  const [showModal, setShowModal] = React.useState(-1)

  _setList = setList

    return (
        <div >
          {ListSearchList.map((option, idx) => (
            <div key={option.id} style={{display: "inline-block"}}>
            <button
              key={option}
              style={{ width: `${widthButton}px`, height: `${widthButton}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`}}
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
                <Typography id="modal-modal-title" component="h2">
                  {option.nameAchievement}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {option.message}
                </Typography>
              </Box>
            </Modal>
          </div>	
          ))}
        </div>
    )
}

export default AchievementBar;