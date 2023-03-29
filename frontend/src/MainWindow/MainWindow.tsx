import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { newWindow } from "../App";
import MainChatWindow, { SetMainChatWindow } from "../Chat/Windows/MainChatWindow";
import { WebsocketContext } from "../Games/contexts/WebsocketContext";
import { Pong } from "../Games/pong/Pong";
import TWTCheckPage from "../TwoFactorSystem/TWTCheckPage";
import LogoutButtonComponent from "../UserProfile/ButtonComponents/LogoutButton";
import SearchBar from "../UserProfile/Search bar/SearchBar";
import SetUsername from "../UserProfile/SetUsername";
import UserProfilePage from "../UserProfile/UserProfile";
import User from "../Utils/Cache/User";
import OurHistory from "../Utils/History";
import HTTP from "../Utils/HTTP";

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

function SetPongWindow(socket:Socket) {
	socket.emit('refresh')
	SetMainWindow('pong')
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
	const socket = React.useContext(WebsocketContext)
	const [currentWindow, setWindow] = useState<string>("")
	const [nameDisplay, setNameDisplay] = useState<string>("");
	const [Display, setDisplay] = useState<boolean>(false);
	_setNameDisplay = setNameDisplay
	_setDisplay = setDisplay
	useEffect(() => {
		if (Display == false){
			asyncToggleGetName()
		}
	}, []); // empty dependency array means it will only run once
	if (Display == true){
		if (nameDisplay == ""){
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
		default: break
	}
	
	return (
		<center>
			<div className={"MainWidnow"} style={{width: `${Math.trunc(window.screen.width * .5)}px`}}>
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
						// onClick={() => SetMainWindow("pong")}
						onClick={() => SetPongWindow(socket)}
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
				</div>
				{display}
			</div>
		</center>
	)
}
