import React, { useState } from 'react';
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
  _setMainWindow = setMainWindow
  _setWindow = setWindow
  /* when set, it changes WHAT list I am getting and HOW it is filtered */
  /* make thigns liek the buttons into seperate components */
  if (Display === false){
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
      <div>
          <div>
          <Tabs value={mainWindow} centered>
            <Tab value="FULL" label="FULL" onClick={() => SetMainProfileWindow("FULL")}/>
            <Tab value="DONE" label="DONE" onClick={() => SetMainProfileWindow("DONE")}/>
            <Tab value="NOT DONE" label="NOT DONE" onClick={() => SetMainProfileWindow("NOT DONE")}/>
          </Tabs>
          </div>
          <center>
            <div style={{ display: 'flex', flexWrap: 'wrap', overflowY: "scroll", width: `${Width * .9}px`, height: `${Width * 0.9}px`, border: "solid", borderColor: "#3676cc", borderRadius: `${Width * 0.01}px`}}>
              {Window}
            </div>
          </center>
      </div>
    )
}

export default FullAchievementBar;