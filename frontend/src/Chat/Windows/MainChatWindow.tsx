import React, { useEffect, useState } from "react";
import ChatWindow from "./Chat/ActualChat/ChatWindow";
import MembersWindow from "./Chat/Members/MembersWindow";
import RoomSelectWindow from "./Chat/RoomSelect/RoomSelectWindow";
import RoomCreation from "./RoomCreation/RoomCreation";
import ChatRoom from "../../Utils/Cache/ChatRoom";
import RoomBrowser from "./RoomBrowser/RoomBrowser";
import User from "../../Utils/Cache/User";
import { Tab, Tabs } from "@mui/material";
import HTTP from "../../Utils/HTTP";
import MainWindow, { Width as MWidth } from "../../MainWindow/MainWindow";

export async function asyncChangeRoom(roomID: string) {
	await ChatRoom.asyncUpdate(roomID, true)
}

export function SetMainChatWindow(window: string) {
	if (!!_setMainWindow)
		_setMainWindow(window)
}
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null

export var ChatLineHeight: number;
export var ChatWindowHeight: number;

export default function MainChatWindow() {
	
	ChatLineHeight = MWidth * .015
	ChatWindowHeight = ChatLineHeight * 25
	
	const [mainWindow, setMainWindow] = useState<string>("chat")
	_setMainWindow = setMainWindow
	
	useEffect(() => {
		const gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement
		if (!gameCanvas)
			return () => ChatRoom.Clear()
		gameCanvas.width = 0
		gameCanvas.height = 0
		return () => ChatRoom.Clear()
	}, [])
	
	if (User.ID === "")
		return <></>
	
	var window
	switch (mainWindow) {
		default:
			return <></>
		case "chat":
			window = <> <RoomSelectWindow/> <ChatWindow/> <MembersWindow/> </>
			break;
		case "rooms":
			window = <RoomBrowser/>	
			break;
		case "newroom":
			window = <RoomCreation/>
			break;
	
	}

	return (
	<div style={{width: `${MWidth * .9}px`, padding: "0px", margin: "0px"}}>
		<div>
			<Tabs value={mainWindow} centered>
				<Tab value="chat" label="Chat" onClick={() => setMainWindow("chat")}/>
				<Tab value="rooms" label="Rooms to Join" onClick={() => setMainWindow("rooms")}/>
				<Tab value="newroom" label="New Room" onClick={() => setMainWindow("newroom")}/>
			</Tabs>
		</div>
		
		{/* MetaDiv */}
		<div style={{
			border: (mainWindow === "chat" ? "solid" : "none"),
			color: "#3676cc",
			borderColor: "#3676cc", borderRadius: "5px",
			width: `100%`, height: `${ChatWindowHeight}px`, lineHeight: `${ChatLineHeight}px`,
			boxSizing: "border-box",
		}}>
			{/* ContentTable */}
			<div style={{display: "table", width: "100%", height: "100%", color: "black"}}>
				{window}
			</div>
		</div>
	</div>
	)
}
