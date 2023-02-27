import React, { useState } from "react";
import ChatWindow, { asyncUpdateChatLog } from "./Chat/ActualChat/ChatWindow";
import MembersWindow from "./Chat/Members/MembersWindow";
import RoomSelectWindow from "./Chat/RoomSelect/RoomSelectWindow";
import User from "../Cache/User";
import ChatUser from "../Cache/ChatUser";
import RoomCreation from "./RoomCreation/RoomCreation";
import ChatRoom from "../Cache/ChatRoom";
import RoomBrowser from "./RoomBrowser/RoomBrowser";

export async function asyncUpdateUserDEBUG(userID: string) {
	if (userID === "")
		return
	ChatRoom.Clear()
	await User.asyncUpdate(userID)
	await ChatUser.asyncUpdate(userID)
	SetMainWindow("chat")
}

export async function asyncChangeRoom(roomID: string) {
	await ChatRoom.asyncUpdate(roomID)
}

export function SetMainWindow(window: string) {
	if (!!_setMainWindow)
		_setMainWindow(window)
}
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null

export default function MainChatWindow() {
	
	const [MainWindow, setMainWindow] = useState<string>("")
	_setMainWindow = setMainWindow
	
	var window
	switch (MainWindow) {
		default:
			return <></>;
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
	<center>
		<div style={{width: "80%"}}>
			<div>
				<button
					onClick={() => setMainWindow("chat")}
					disabled={MainWindow === "chat"}
					>Chat</button>
				<button
					onClick={() => setMainWindow("rooms")}
					disabled={MainWindow === "rooms"}
					>Rooms to Join</button>
				<button
					onClick={() => setMainWindow("newroom")}
					disabled={MainWindow === "newroom"}
					>New Room</button>
			</div>
			
			{/* MetaDiv */}
			<div style={{border: "solid", width: "100%", height: "5.5cm", overflow: "hidden", lineHeight: ".5cm"}}>
				{/* ContentTable */}
				<div style={{display: "table", width: "100%", height: "100%"}}>
					{window}
				</div>
			</div>
		</div>
	</center>
	)
}
