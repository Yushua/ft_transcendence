import React, { useEffect, useState } from "react";
import MainChatWindow, { SetMainChatWindow } from "../Chat/Windows/MainChatWindow";
import { Pong } from "../Games/pong/Pong";
import LogoutButtonComponent from "../UserProfile/LogoutButton";
import UserProfilePage from "../UserProfile/UserProfile";
import OurHistory from "../Utils/History";

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

export default function MainWindow() {
	
	const [currentWindow, setWindow] = useState<string>("")
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
