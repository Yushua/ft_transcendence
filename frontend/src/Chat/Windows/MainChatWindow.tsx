import React, { useState } from "react";
import ChatWindow from "./Chat/ActualChat/ChatWindow";
import MembersWindow from "./Chat/Members/MembersWindow";
import RoomSelectWindow from "./Chat/RoomSelect/RoomSelectWindow";
import RoomCreation from "./RoomCreation/RoomCreation";
import ChatRoom from "../../Utils/Cache/ChatRoom";
import RoomBrowser from "./RoomBrowser/RoomBrowser";
import User from "../../Utils/Cache/User";
import HTTP from "../../Utils/HTTP";
import { EmptyCanvas } from "../../Games/pong/components/EmtpyCanvas";
import { Button } from "@mui/material";

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
			<Button variant={MainWindow === "chat" ? "contained" : "outlined"}
				onClick={() => setMainWindow("chat")}
				>Chat</Button>
			<Button variant={MainWindow === "rooms" ? "contained" : "outlined"}
				onClick={() => setMainWindow("rooms")}
				>Rooms to Join</Button>
			<Button variant={MainWindow === "newroom" ? "contained" : "outlined"}
				onClick={() => setMainWindow("newroom")}
				>New Room</Button>
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
		<EmptyCanvas/>
	</>
	)
}
