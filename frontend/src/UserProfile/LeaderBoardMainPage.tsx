import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Width } from "../MainWindow/MainWindow";
import TotalWins from "../LeaderBoards/TotalWins";
import PongWins from "../LeaderBoards/PongWins";
import TotalExpWins from "../LeaderBoards/TotalExpWins";

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
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null
var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>
var _setWindow: any

function LeaderBoardMainPage() {
  const [mainWindow, setMainWindow] = useState<string>("totalWins")
  const [Window, setWindow] = useState<any>(<div></div>)
  const [Display, setDisplay] = useState<boolean>(false)
	_setMainWindow = setMainWindow
  _setWindow = setWindow
  _setDisplay = setDisplay
  if (Display == false){
    switch (mainWindow) {
      default:
        return <></>
      case "totalWins":
        SetWindowProfile(<TotalWins/>)
        break;
      case "PongWins":
      	SetWindowProfile(<PongWins/>)
      	break;
      case "TotalExpWins":
        SetWindowProfile(<TotalExpWins/>)
        break;
    }
	}
  return (
    <div style={{width: `${Width * .9}px`, padding: "0px", margin: "0px"}}>
      <div>
        <Tabs value={mainWindow} centered>
          <Tab value="totalWins" label="totalWins" onClick={() => SetMainProfileWindow("totalWins")}/>
          <Tab value="PongWins" label="PongWins" onClick={() => SetMainProfileWindow("PongWins")}/>
          <Tab value="TotalExpWins" label="TotalExpWins" onClick={() => SetMainProfileWindow("TotalExpWins")}/>
        </Tabs>
      </div>
      <div style={{display: "table", width: "100%", height: "100%", color: "black"}}>
        <center>
          <div style={{ display: "flex", width: `${Width * .9}px`, height: `${Width * 1.5}px`, overflowY: "scroll", border: "solid", borderColor: "#3676cc", borderRadius: `${Width * 0.01}px`, }}>
          {Window}
          </div>
        </center>
      </div>
	  </div>
  );
}

export default LeaderBoardMainPage;
