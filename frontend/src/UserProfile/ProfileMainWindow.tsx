import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import UserProfilePage from "./UserProfile";
import SearchBar from "../Search bar/SearchBar";
import SettingsUser from "./SettingsUser";
import { Width } from "../MainWindow/MainWindow";
import User from "../Utils/Cache/User";
import TWTDisabled from "../TwoFactorSystem/TWTDisabled";
import TWTEnabled from "../TwoFactorSystem/TWTEnabled";
import LeaderBoardMainPage from "./LeaderBoardMainPage";
import FullAchievementBar from "../Search bar/FullAchievementBar";
import OurHistory from "../Utils/History";
import { SetMainChatWindow } from "../Chat/Windows/MainChatWindow";
import OtherUserProfile from "./ProfilePages/OtherUserProfile";

export function SetMainProfileWindow(window: string) {
	if (!!_setMainWindow){
		_setMainWindow(window)
    _setDisplay(false)
  }
}

export function SetWindowProfile(window: any, add_to_history = false) {
	if (!!_setWindow){
    _setWindow(window)
    _setDisplay(true)
  }
  if (add_to_history) {
    OurHistory.Add("ProfileView", {id: window.props.id}, async args => {
      const id = args.get('id')
      if (id) {
        const other_page = <OtherUserProfile id={id}/>
        SetWindowProfile(other_page)
        setTimeout(() => {
          SetWindowProfile(other_page)
        }, 0);
      }
    })
  }
}
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null
var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>
var _setWindow: any

function ProfileMainWindow() {
  const [mainWindow, setMainWindow] = useState<string>("profile")
  const [Window, setWindow] = useState<any>(<UserProfilePage/>)
  const [Display, setDisplay] = useState<boolean>(true)
	_setMainWindow = setMainWindow
  _setWindow = setWindow
  _setDisplay = setDisplay
  
  useEffect(() => {
    OurHistory.ClearEvent.Subscribe(() => {_setDisplay(false)})
  })
  
  if (Display === false){
    switch (mainWindow) {
      default:
        return <></>
      case "profile":
        SetWindowProfile(<UserProfilePage/>)
        break;
      case "search":
      	SetWindowProfile(<SearchBar/>)
      	break;
      case "TWTDisplay":
        if (User.TWTStatus === true){
          SetWindowProfile(<TWTDisabled/>)
        }
        else {
          SetWindowProfile(<TWTEnabled/>)
        }
      	break;
      case "leaderBoard":
          SetWindowProfile(<LeaderBoardMainPage/>)
          break;
      case "settings":
        SetWindowProfile(<SettingsUser/>)
        break;
      case "Achievements":
        SetWindowProfile(<FullAchievementBar id={User.ID}/>)
        break;
    }
	}
  return (
    <div style={{width: `${Width * .9}px`, padding: "0px", margin: "0px"}}>
      <div>
        <Tabs value={mainWindow} centered>
          <Tab value="profile" label="profile" onClick={() => {
            SetMainProfileWindow("profile")
            if (document.getElementById("OtherProfilePage"))
              OurHistory.Add()
          }}/>
          <Tab value="search" label="search user" onClick={() => SetMainProfileWindow("search")}/>
          <Tab value="TWTDisplay" label="Authentication" onClick={() => SetMainProfileWindow("TWTDisplay")}/>
          <Tab value="leaderBoard" label="LeaderBoard" onClick={() => SetMainProfileWindow("leaderBoard")}/>
          <Tab value="Achievements" label="Achievements" onClick={() => SetMainProfileWindow("Achievements")}/>
          <Tab value="settings" label="settings" onClick={() => SetMainProfileWindow("settings")}/>
        </Tabs>
      </div>
      <div style={{display: "table", width: "100%", height: "100%", color: "black"}}>
        {Window}
      </div>
	  </div>
  );
}

export default ProfileMainWindow;
