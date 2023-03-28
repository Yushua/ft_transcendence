import React, { useEffect, useState } from "react";
import ChatWindow from "./Chat/ActualChat/ChatWindow";
import MembersWindow from "./Chat/Members/MembersWindow";
import RoomSelectWindow from "./Chat/RoomSelect/RoomSelectWindow";
import RoomCreation from "./RoomCreation/RoomCreation";
import ChatRoom from "../../Utils/Cache/ChatRoom";
import RoomBrowser from "./RoomBrowser/RoomBrowser";
import User from "../../Utils/Cache/User";
import { Tab, Tabs } from "@mui/material";

export async function asyncChangeRoom(roomID: string) {
	await ChatRoom.asyncUpdate(roomID, true)
}

export function SetMainChatWindow(window: string) {
	if (!!_setMainWindow)
		_setMainWindow(window)
}
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null

export default function MainChatWindow() {
	
	const [MainWindow, setMainWindow] = useState<string>("chat")
	_setMainWindow = setMainWindow
	
	useEffect(() => () => ChatRoom.Clear(), [])
	
	if (User.ID === "")
		return <></>
	
	var window
	switch (MainWindow) {
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
	<>
		<div>
			<Tabs value={MainWindow} centered>
				<Tab label="Chat" value="chat" onClick={() => setMainWindow("chat")}/>
				<Tab label="Rooms to Join" value="rooms" onClick={() => setMainWindow("rooms")}/>
				<Tab label="New Room" value="newroom" onClick={() => setMainWindow("newroom")}/>
			</Tabs>
		</div>
		
		{/* MetaDiv */}
		<div
			style={{
				border: (MainWindow === "chat" ? "solid" : "none"),
				color: "#3676cc",
				borderColor: "#3676cc", borderRadius: ".1cm",
				width: "100%", height: "5.6cm", lineHeight: ".5cm"}}
		>
			{/* ContentTable */}
			<div style={{display: "table", width: "100%", height: "100%", color: "black"}}>
				{window}
			</div>
		</div>
		{/* <button onClick={() => {
			HTTP.Delete("chat/all")
			ChatRoom.Clear()
		}}>DEBUG: Delete all chat data</button> */}
	</>
	)
}
