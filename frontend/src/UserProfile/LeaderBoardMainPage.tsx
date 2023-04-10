import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import UserProfilePage from "./UserProfile";
import SearchBar from "../Search bar/SearchBar";
import SettingsUser from "./SettingsUser";
import { Width } from "../MainWindow/MainWindow";
import User from "../Utils/Cache/User";
import TWTDisabled from "../TwoFactorSystem/TWTDisabled";
import TWTEnabled from "../TwoFactorSystem/TWTEnabled";
import LeaderBoard from "../LeaderBoards/LeaderBoard";

export function SetMainProfileWindow(window: string) {
	if (!!_setMainWindow){
		_setMainWindow(window)
    _setDisplay(false)
  }
}

export function SetWindowProfile(window: any) {
	if (!!_setWindow){
		_setWindow(window)
    _setDisplay(true)
  }
}
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null
var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>
var _setWindow: any

function LeaderBoardMainPage() {
  const [mainWindow, setMainWindow] = useState<string>("")
  const [Window, setWindow] = useState<any>(<UserProfilePage/>)
  const [Display, setDisplay] = useState<boolean>(false)
	_setMainWindow = setMainWindow
  _setWindow = setWindow
  _setDisplay = setDisplay
  if (Display == false){
    console.log(`mainwindow {${mainWindow}}`)
    switch (mainWindow) {
      default:
        return <></>
      case "profile":
        SetWindowProfile(<UserProfilePage/>)
        break;
      case "search":
      	SetWindowProfile(<SearchBar/>)
      	break;
      case "settings":
        SetWindowProfile(<SettingsUser/>)
        break;
    }
	}
  return (
    <div style={{width: `${Width * .9}px`, padding: "0px", margin: "0px"}}>
      <div>
        <Tabs value={mainWindow} centered>
          <Tab value="profile" label="profile" onClick={() => SetMainProfileWindow("profile")}/>
          <Tab value="search" label="search user" onClick={() => SetMainProfileWindow("search")}/>
          <Tab value="tWTDisplay" label="TwoFactor" onClick={() => SetMainProfileWindow("tWTDisplay")}/>
        </Tabs>
      </div>
      <div style={{display: "table", width: "100%", height: "100%", color: "black"}}>
        {Window}
      </div>
	  </div>
  );
}

export default LeaderBoardMainPage;
