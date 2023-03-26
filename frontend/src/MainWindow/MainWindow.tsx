import React, { useEffect, useState } from "react";
import { newWindow } from "../App";
import MainChatWindow, { SetMainChatWindow } from "../Chat/Windows/MainChatWindow";
import { Pong } from "../Games/pong/Pong";
import TWTCheckPage from "../TwoFactorSystem/TWTCheckPage";
import SearchBar from "../Search bar/SearchBar";
import SetUsername from "../UserProfile/SetUsername";
import UserProfilePage from "../UserProfile/UserProfile";
import User from "../Utils/Cache/User";
import OurHistory from "../Utils/History";
import HTTP from "../Utils/HTTP";
import LogoutButtonComponent from "../ButtonComponents/LogoutButton";
import SettingsUser from "../UserProfile/SettingsUser";

async function asyncGetName():Promise<string> {
	const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
	var user = await JSON.parse(response)
	User._ManualUpdate(user["user"])
	return await user["username"];
  }

export function GetCurrentWindow() {
	return _currentWindow
}
var _currentWindow: string

export function SetMainWindow(window: string, new_window = true) {
	_currentWindow = window
	if (!!_setWindow)
		_setWindow(window)
	if (new_window)
		OurHistory.Add()
}
var _setWindow: React.Dispatch<React.SetStateAction<string>> | null = null

var _setNameDisplay: React.Dispatch<React.SetStateAction<string>>
var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>
var _setTWTDisplay: React.Dispatch<React.SetStateAction<string>>
async function asyncToggleGetName(){
	_setNameDisplay(await asyncGetName())
	_setDisplay(true)
  };


export default function MainWindow() {
	const [currentWindow, setWindow] = useState<string>("")
	const [nameDisplay, setNameDisplay] = useState<string>("");
	const [Display, setDisplay] = useState<boolean>(false);
	_setNameDisplay = setNameDisplay
	_setDisplay = setDisplay
	useEffect(() => {
		if (Display === false){
			asyncToggleGetName()
		}
	}, []); // empty dependency array means it will only run once
	if (Display === true){
		if (nameDisplay === ""){
			newWindow(<SetUsername/>)
		}
	}

	_setWindow = setWindow
	_currentWindow = currentWindow
	
	useEffect(OurHistory.Add, [])
	
	var display = <></>
	switch (currentWindow) {
		case "profile": display = <UserProfilePage/>; break
		case "chat": display = <MainChatWindow/>; break
		case "pong": display = <Pong/>; break
		case "Search": display = <SearchBar/>; break
		case "TWTDisplay": display = <TWTCheckPage/>; break
		case "Settings": display = <SettingsUser/>; break
		default: break
	}
	
	return (
		<div>
			<div>
				<LogoutButtonComponent/>
				<button
					onClick={() => SetMainWindow("profile")}
					disabled={currentWindow === "profile"}
					>Profile</button>
				<button
					onClick={() => SetMainWindow("chat")}
					disabled={currentWindow === "chat"}
					>Chat</button>
				<button
					onClick={() => SetMainWindow("pong")}
					disabled={currentWindow === "pong"}
					>Play Pong</button>
				<button
					onClick={() => SetMainWindow("Search")}
					disabled={currentWindow === "Search"}
					>Search</button>
				<button
					onClick={() => SetMainWindow("TWTDisplay")}
					disabled={currentWindow === "TWTDisplay"}
					>TwoFactor</button>
				<button
					onClick={() => SetMainWindow("Settings")}
					disabled={currentWindow === "Settings"}
					>Settings</button>
			</div>
			{display}
		</div>
	)
}
