import React, { useEffect, useState } from "react";
import { newWindow } from "../App";
import { Pong } from "../Games/pong/Pong";
import SetUsername from "../UserProfile/SetUsername";
import User from "../Utils/Cache/User";
import OurHistory from "../Utils/History";
import HTTP from "../Utils/HTTP";
import { AppBar, Box, Button, Container, IconButton, Toolbar } from "@mui/material";
import NameStorage from "../Utils/Cache/NameStorage";
import { WebsocketContext } from "../Games/contexts/WebsocketContext";
import MainChatWindow from "../Chat/Windows/MainChatWindow";
import ProfileMainWindow, { SetWindowProfile } from "../UserProfile/ProfileMainWindow";
import ChatRoom from "../Utils/Cache/ChatRoom";
import OtherUserProfile from "../UserProfile/ProfilePages/OtherUserProfile";
import ErrorPage from "../Login/ErrorPage";

export async function asyncGetNameExport():Promise<string> {
	try {
		const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
		var user = await JSON.parse(response)
		User._ManualUpdate(user)
		return User.Name;
	} catch (error) {
		newWindow(<ErrorPage message={`MainWindow error, Couldn't get the user data due to ${error}`}/>)
	}
}

export function GetCurrentMainWindow() {
	return _currentWindow
}
var _currentWindow: string

export function SetMainWindow(window: string, add_to_history = true) {
	_currentWindow = window
	if (!!_setWindow)
		_setWindow(window)
	if (add_to_history)
		OurHistory.Add()
}
var _setWindow: React.Dispatch<React.SetStateAction<string>> | null = null

async function asyncToggleGetName(){
	const name = await asyncGetNameExport()
	if (name === "") {
		newWindow(<SetUsername/>)
		return false
	}
	_setWindow(" ")
	return true
}

export var Width: number = Math.trunc(window.screen.width * .5)

export default function MainWindow() {
	Width = Math.trunc(window.screen.width * .5)
	const socket = React.useContext(WebsocketContext)
	const [currentWindow, setWindow] = useState<string>("")

	_setWindow = setWindow
	_currentWindow = currentWindow
	
	useEffect(() => {
		asyncToggleGetName().then(res => {
			if (!res)
				return
			const params = new URLSearchParams(window.location.search)
			const page = params.get("window")
			if (!page) {
				OurHistory.Add()
				return
			}
			setWindow(page)
			switch (page) {
				case "chat":
					const roomID = params.get("roomID")
					if (!!roomID)
						ChatRoom.asyncUpdate(roomID)
					break
				case "profile":
					const id = params.get("id")
					if (!!id)
						setTimeout(async () => {
							SetWindowProfile(<OtherUserProfile id={id}/>, true)
						}, 100)
					break
				default:
					break
			}
		})
	}, [])
	
	var display = <></>
	switch (currentWindow) {
		case "profile": display = <ProfileMainWindow/>; break
		case "chat": display = <MainChatWindow/>; break
		case "pong": display = <Pong/>; socket.emit('refresh'); break
		default: break
	}

	const _buttonDistance = "2%"
	return (
		<center>
			<div className={"MainWidnow"} style={{width: `${Width}px`}}>
				<AppBar position="static">
					<Container maxWidth="xl">
						<Toolbar disableGutters>
							
							{/* Logo */}
							<Box
								onClick={() => SetMainWindow("")}
								fontFamily={"'Courier New', monospace"}
								fontSize={"200%"}>
								Team-Zero
							</Box>
							
							{/* Change Window Buttons */}
							{[	["profile", "Profile"],
								["chat", "Chat"],
								["pong", "Play Pong"],
								].map(pair =>
							<Box key={pair[0]} sx={{ pl:_buttonDistance }}>
								<Button
									sx={{ my: 2, color: 'white', display: 'block' }}
									onClick={() => SetMainWindow(pair[0])}>
										{pair[1]}
								</Button>
							</Box>)}
							{/* Avatar */}
							<Box sx={{ position: "absolute", right: "0px" }}>
								<IconButton sx={{ p: 0 }} onClick={() => SetMainWindow("profile")}>
									<img alt="" src={User.ID !== "" ? `${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(User.ID)}` : ""}
										style={{width: `${Width * .04}px`, height: `${Width * .04}px`, borderRadius: "50%"}}/>
								</IconButton>
							</Box>
						</Toolbar>
					</Container>
				</AppBar>
				{display}
				<canvas id="game-canvas" style={{width: "100%"}}></canvas>
			</div>
		</center>
	)
}
