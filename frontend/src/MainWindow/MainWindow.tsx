import React, { useEffect, useState } from "react";
import { newWindow } from "../App";
import { Pong } from "../Games/pong/Pong";
import TWTCheckPage from "../TwoFactorSystem/TWTCheckPage";
import SetUsername from "../UserProfile/SetUsername";
import UserProfilePage from "../UserProfile/UserProfile";
import User from "../Utils/Cache/User";
import OurHistory from "../Utils/History";
import HTTP from "../Utils/HTTP";
import { AppBar, Box, Button, Container, IconButton, Toolbar } from "@mui/material";
import NameStorage from "../Utils/Cache/NameStorage";
import { WebsocketContext } from "../Games/contexts/WebsocketContext";
import MainChatWindow from "../Chat/Windows/MainChatWindow";
import SearchBar from "../Search bar/SearchBar";
import SettingsUser from "../UserProfile/SettingsUser";
import TestPage from "../UserProfile/TestPage";
import LogoutButtonComponent from "../ButtonComponents/LogoutButton";

export async function asyncGetNameExport():Promise<string> {
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
async function asyncToggleGetName(){
	_setNameDisplay(await asyncGetNameExport())
	_setDisplay(true)
  };


export const Width: number = Math.trunc(window.screen.width * .5)

export default function MainWindow() {
	const socket = React.useContext(WebsocketContext)
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
		case "pong": display = <Pong/>; socket.emit('refresh'); break
		case "Search": display = <SearchBar/>; break
		case "TWTDisplay": display = <TWTCheckPage/>; break
		case "Settings": display = <SettingsUser/>; break
		case "TestPage": display = <TestPage/>; break
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
								fontFamily={"'Courier New', monospace"}
								fontSize={"200%"}>
								Team-Zero
							</Box>
							
							{/* Change Window Buttons */}
							{[	["profile", "Profile"],
								["chat", "Chat"],
								["pong", "Play Pong"],
								["Search", "Search"],
								["TWTDisplay", "TwoFactor"],
								].map(pair =>
							<Box key={pair[0]} sx={{ pl:_buttonDistance }}>
								<Button
									sx={{ my: 2, color: 'white', display: 'block' }}
									onClick={() => SetMainWindow(pair[0])}>
										{pair[1]}
								</Button>
							</Box>)}
							{/* Logout Button */}
							<Box sx={{ pl:_buttonDistance }}>
								<Button sx={{ color: 'white', display: 'block' }}
									onClick={() => newWindow(<LogoutButtonComponent/>)}>Logout
								</Button>
							</Box>
							{/* Avatar */}
							<Box sx={{ position: "absolute", right: "0px" }}>
								<IconButton sx={{ p: 0 }} onClick={() => SetMainWindow("profile")}>
									<img src={User.ID !== "" ? `${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(User.ID)}` : ""}
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
