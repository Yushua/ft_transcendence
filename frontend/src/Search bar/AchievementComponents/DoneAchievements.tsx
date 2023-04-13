import React, { useState } from 'react';
import HTTP from '../../Utils/HTTP';
import User from '../../Utils/Cache/User';
import { Width } from '../../MainWindow/MainWindow';
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
  };

async function getAchieveDoneList():Promise<any>{
  const response = HTTP.Get(`user-profile/GetAchievementListDone/${User.ID}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
  return Object.values(result["list"])
}

var _setList:React.Dispatch<React.SetStateAction<string[][]>>

var _setList:React.Dispatch<React.SetStateAction<string[][]>>
 //get into page, get the entire list online
 function DoneAchievements(props: any){
  const [ListSearchList, setList] = useState<any[]>([]);
  const [showModal, setShowModal] = React.useState(-1)
  const [Display, setDisplay] = useState<boolean>(false)
  _setList = setList
 
 var widthButton:number = (((Width*0.9) - (Width*0.9*0.03 * 3 * 2))/3)

 _setList = setList
  if (Display == false){
    asyncPutList()
  }

  async function asyncPutList(){
    await getAchieveDoneList()
    setDisplay(true)
  }

   return (
       <div >
         {ListSearchList.map((option, idx) => (
           <div key={option.id} style={{display: "inline-block"}}>
           <button
             key={option}
             style={{ width: `${widthButton}px`, height: `${widthButton}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
             onClick={() => setShowModal(idx)}>
               <img src={`${HTTP.HostRedirect()}pfp/${option.pictureLink}`} alt="" style={{width: `${widthButton - Width*0.03}px`, height: `${widthButton - Width*0.03}px`, border: "4px solid black"}}/>
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

export default DoneAchievements;
