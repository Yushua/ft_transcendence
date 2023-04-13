import React, { useState } from 'react';
import HTTP from '../Utils/HTTP';
import { Tab, Tabs } from '@mui/material';
import { Width } from '../MainWindow/MainWindow';
import FullAchievements from './AchievementComponents/FullAchievements';
import DoneAchievements from './AchievementComponents/DoneAchievements';
import NotDoneAchievements from './AchievementComponents/NotDoneAchievements';

function SetMainProfileWindow(window: string) {
  if (!!_setMainWindow){
    _setMainWindow(window)
    _setDisplay(false)
  }
}

function SetWindowProfile(window: any) {
	if (!!_setWindow){
		_setWindow(window)
    _setDisplay(true)
  }
}

var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null
var _setWindow: any

function FullAchievementBar(props: any) {
  //get into page, get the entire list online
  const [Display, setDisplay] = useState<boolean>(false)
  const [mainWindow, setMainWindow] = useState<string>("FULL")
  const [Window, setWindow] = useState<any>(<div></div>)

  _setDisplay = setDisplay
  /* when set, it changes WHAT list I am getting and HOW it is filtered */
  if (Display == false){
    switch (mainWindow) {
      default:
        return <></>
      case "FULL":
        SetWindowProfile(<FullAchievements/>)
        break;
      case "DONE":
        SetWindowProfile(<DoneAchievements/>)
        break;
      case "NOT DONE":
        SetWindowProfile(<NotDoneAchievements/>)
        break;
    }
	}

    return (
        <div >
          <div>
          <Tabs value={mainWindow} centered>
            <Tab value="FULL" label="FULL" onClick={() => SetMainProfileWindow("FULL")}/>
            <Tab value="DONE" label="DONE" onClick={() => SetMainProfileWindow("DONE")}/>
            <Tab value="NOT DONE" label="NOT DONE" onClick={() => SetMainProfileWindow("NOT DONE")}/>
          </Tabs>
          </div>
          <div style={{display: "table", width: "100%", height: "100%", color: "black"}}>
            <center>
              <div style={{width: `${Width*0.9}px`, height: `${Width*1.5}px`, overflowY: "scroll", border: "2px solid black"}}>
                {Window}
              </div>
            </center>
          </div>
        </div>
    )
}

export default FullAchievementBar;