import React, { useState } from "react";
import HTTP from "../HTTP";
import ChatWindow, { asyncUpdateChatLog } from "./ChatWindow";
import MembersList from "./MembersList";
import RoomSelectWindow from "./RoomSelectWindow";
import User from "../Downloadable/User";
import ChatUser from "../Downloadable/ChatUser";
import NameStorage from "../NameStorage";
import RoomCreation from "./RoomCreation";
import ChatRoom from "../Downloadable/ChatRoom";
import { asyncUpdateFriendsList } from "./FriendsList";
import { asyncUpdateRoomList } from "./RoomList";

export async function asyncUpdateUser(userID: string) {
	if (userID === "")
		return
	ChatRoom.Clear()
	await asyncUpdateChatLog()
	await User.asyncDownload(userID)
	await ChatUser.asyncDownload(userID)
	SetMainWindow(`load ${userID}`)
}

export async function asyncChangeRoom(roomID: string) {
	await ChatRoom.asyncDownload(roomID)
	asyncUpdateFriendsList()
	asyncUpdateRoomList()
	asyncUpdateChatLog()
}

export function SetMainWindow(window: string) {
	if (!!_setMainWindow)
		_setMainWindow(window)
}
var _setMainWindow: React.Dispatch<React.SetStateAction<string>> | null = null

async function _load() {
	for (const friendID of User.Friends)
		await NameStorage.asyncGetUser(friendID)
	SetMainWindow("chat")
}

export default function MainChatWindow(props: any) {
	var onSelectCallBack: (userID: string) => void = props.onSelectCallBack
	
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
			window = <> <RoomSelectWindow/> <ChatWindow/> <MembersList/> </>
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
			<div style={{border: "solid", overflow: "hidden", width: "80%"}}>
				<div>
					<button onClick={() => setMainWindow("chat")}>Chat</button>
					<button onClick={() => setMainWindow("servers")}>Servers</button>
					<button onClick={() => setMainWindow("newroom")}>NewRoom</button>
				</div>
				<div style={{display: "table", width: "100%"}}> {window} </div>
			</div>
		</center>
	)
}
