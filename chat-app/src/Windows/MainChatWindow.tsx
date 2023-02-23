import React, { useState } from "react";
import ChatWindow, { asyncUpdateChatLog } from "./Chat/ActualChat/ChatWindow";
import MembersWindow from "./Chat/Members/MembersWindow";
import RoomSelectWindow from "./Chat/RoomSelect/RoomSelectWindow";
import User from "../Downloadable/User";
import ChatUser from "../Downloadable/ChatUser";
import NameStorage from "../Downloadable/NameStorage";
import RoomCreation from "./RoomCreation/RoomCreation";
import ChatRoom from "../Downloadable/ChatRoom";

export async function asyncUpdateUser(userID: string) {
	if (userID === "")
		return
	ChatRoom.Clear()
	await User.asyncDownload(userID)
	await ChatUser.asyncDownload(userID)
	SetMainWindow(`load ${userID}`)
}

export async function asyncChangeRoom(roomID: string) {
	await ChatRoom.asyncDownload(roomID)
	asyncUpdateChatLog()
}

export function SetMainWindow(window: string) {
	if (!!_setMainWindow)
		_setMainWindow(window)
}
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null

async function _load() {
	SetMainWindow("chat")
}

export default function MainChatWindow() {
	
	const [MainWindow, setMainWindow] = useState<string>("")
	_setMainWindow = setMainWindow
	
	const special = MainWindow.substring(0, 4)
	switch (special) {
		case "load":
			_load()
			return <>Loading...</>;
		default:
			break;
	}
	
	var window
	switch (MainWindow) {
		default:
			return <></>;
		case "chat":
			window = <> <RoomSelectWindow/> <ChatWindow/> <MembersWindow/> </>
			break;
		case "servers":
			window = <> TODO: Server browser </>	
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
					onClick={() => setMainWindow("servers")}
					disabled={MainWindow === "servers"}
					>Servers</button>
				<button
					onClick={() => setMainWindow("newroom")}
					disabled={MainWindow === "newroom"}
					>NewRoom</button>
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
