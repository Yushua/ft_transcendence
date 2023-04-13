import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
import { Box, Modal, Tab, Tabs, Typography } from '@mui/material';
import User from '../Utils/Cache/User';
import { Width } from '../MainWindow/MainWindow';

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

function SetMainProfileWindow(window: string) {
  if (!!_setMainWindow){
    _setMainWindow(window)
    _setDisplay(false)
  }
}

async function getAchieveFullList(id:string):Promise<any>{
  const response = HTTP.Get(`user-profile/GetAchievementListFull/${id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
  return Object.values(result["list"])
}

async function getAchieveDoneList(id:string):Promise<any>{
  const response = HTTP.Get(`user-profile/GetAchievementListDone/${id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
  return Object.values(result["list"])
}

async function getAchieveNotDoneList(id:string):Promise<any>{
  const response = HTTP.Get(`user-profile/GetAchievementListNotDone/${id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
  return Object.values(result["list"])
}

var _setList:React.Dispatch<React.SetStateAction<string[]>>


var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null
var _setWindow: any

function FullAchievementBar(props: any) {
  //get into page, get the entire list online
  const [List, setList] = useState<any[]>([]);
  const [Display, setDisplay] = useState<boolean>(false)
  const [mainWindow, setMainWindow] = useState<string>("everything")
  const [Window, setWindow] = useState<any>(<div></div>)

  const [showModal, setShowModal] = React.useState(-1)

  var widthButton:number = (((Width*0.9) - (Width*0.9*0.03 * 3 * 2))/3)
  _setList = setList
  _setDisplay = setDisplay
  /* when set, it changes WHAT list I am getting and HOW it is filtered */
  if (Display == false){
    switch (mainWindow) {
      default:
        return <></>
      case "everything":
        returnFull()
        break;
      case "finished":
        returnDone()
        break;
      case "not finished":
        returnNotDone()
        break;
    }
	}

  async function returnFull(){
    setList(await getAchieveFullList(props.id))
  }

  async function returnDone(){
    setList(await getAchieveDoneList(props.id))
  }

  async function returnNotDone(){
    setList(await getAchieveNotDoneList(props.id))
  }
    return (
        <div >
          <div>
          <Tabs value={mainWindow} centered>
            <Tab value="everything" label="everything" onClick={() => SetMainProfileWindow("everything")}/>
            <Tab value="finished" label="finished" onClick={() => SetMainProfileWindow("finished")}/>
            <Tab value="not finished" label="not finished" onClick={() => SetMainProfileWindow("not finished")}/>
          </Tabs>
          </div>
          <div style={{width: `${Width*0.9}px`, height: `${Width*1.5}px`, overflowY: "scroll", border: "2px solid black"}}>
            {List.map((option, idx) => (
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
        </div>
    )
}

export default FullAchievementBar;