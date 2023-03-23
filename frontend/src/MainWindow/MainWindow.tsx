import React, { useEffect, useState } from "react";
import { newWindow } from "../App";
import MainChatWindow, { SetMainChatWindow } from "../Chat/Windows/MainChatWindow";
import { Pong } from "../Games/pong/Pong";
import LogoutButtonComponent from "../UserProfile/ButtonComponents/LogoutButton";
import SetUsername from "../UserProfile/SetUsername";
import UserProfilePage from "../UserProfile/UserProfile";
import OurHistory from "../Utils/History";
import HTTP from "../Utils/HTTP";

async function asyncGetName():Promise<string> {
	const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
	var result = await JSON.parse(response)
	return await result["username"];
  }

export function GetCurrentWindow() {
	return _currentWindow
}
var _currentWindow: string

export function SetMainWindow(window: string, new_window = true) {
	_currentWindow = window
	if (new_window)
		OurHistory.Add()
	if (!!_setWindow)
		_setWindow(window)
}
var _setWindow: React.Dispatch<React.SetStateAction<string>> | null = null

var _setNameDisplay: React.Dispatch<React.SetStateAction<string>> | null = null
var _setDisplay: React.Dispatch<React.SetStateAction<boolean>> | null = null
async function asyncToggleGetName(){
	const a = await asyncGetName()
	console.log(a)
	_setNameDisplay(a)
	_setDisplay(true)
	newWindow(<MainWindow/>)
  };


export default function MainWindow() {
	const [currentWindow, setWindow] = useState<string>("")
	const [nameDisplay, setNameDisplay] = useState<string>("");
	const [Display, setDisplay] = useState<boolean>(false);
	_setNameDisplay = setNameDisplay
	_setDisplay = setDisplay
	if (Display == false){
		asyncToggleGetName()
	}
	if (nameDisplay === ""){
		alert(`nameDisplay change {${nameDisplay}}`)
		newWindow(<SetUsername/>)
	  }

	_setWindow = setWindow
	_currentWindow = currentWindow
	
	useEffect(OurHistory.Add, [])
	
	var display = <></>
	switch (currentWindow) {
		case "profile": display = <UserProfilePage/>; break
		case "chat": display = <MainChatWindow/>; break
		case "pong": display = <Pong/>; break
		default: break
	}
	
	return (
		<div>
			<div>
				<LogoutButtonComponent />
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
			</div>
			{display}
		</div>
	)
}
