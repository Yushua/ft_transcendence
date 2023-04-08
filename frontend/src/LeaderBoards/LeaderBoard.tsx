import React, { useEffect, useState } from "react";
import { newWindow } from "../App";
import SetUsername from "../UserProfile/SetUsername";
import User from "../Utils/Cache/User";
import OurHistory from "../Utils/History";
import HTTP from "../Utils/HTTP";
import { AppBar, Box, Button, Container, IconButton, Toolbar } from "@mui/material";
import NameStorage from "../Utils/Cache/NameStorage";
import { WebsocketContext } from "../Games/contexts/WebsocketContext";
import LogoutButtonComponent from "../ButtonComponents/LogoutButton";
import MainWindow, { Width } from "../MainWindow/MainWindow";

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

function LeaderBoard() {
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
		case "mainWindow": display = <MainWindow/>; break
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
								LeaderBoard
							</Box>
							
							{/* Change Window Buttons
							{[	["mainWindow", "MainWindow"],
								].map(pair =>
							<Box key={pair[0]} sx={{ pl:_buttonDistance }}>
								<Button
									sx={{ my: 2, color: 'white', display: 'block' }}
									onClick={() => SetMainWindow(pair[0])}>
										{pair[1]}
								</Button>
							</Box>)} */}
							{/* Logout Button */}
							<Box sx={{ pl:_buttonDistance }}>
								<Button sx={{ color: 'white', display: 'block' }}
									onClick={() => newWindow(<MainWindow/>)}>MainWindow
								</Button>
							</Box>
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

export default LeaderBoard;