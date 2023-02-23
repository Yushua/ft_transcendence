import React, { useState } from "react";
import HTTP from "../HTTP";
import ChatUser from "../Downloadable/ChatUser";
import ChatRoom from "../Downloadable/ChatRoom";
import NameStorage from "../NameStorage";
import { asyncChangeRoom } from "./MainChatWindow";

export async function asyncUpdateRoomList() {
	if (!_setRooms)
		return
	for (const roomID of ChatUser.ChatRoomsIn)
		await NameStorage.GetRoom(roomID)
	
	_setRooms(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatUser.ChatRoomsIn.map(roomID => {
		if (ChatRoom.ID === roomID)
			return (<div
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".45cm"}}>
				{NameStorage.GetRoom(roomID)}</div>)
		else
			return (<><button
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
			onClick={_ => asyncChangeRoom(roomID)}>
				{NameStorage.GetRoom(roomID)}</button><br/></>)
	})
}

var _setRooms: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null

export default function RoomList() {
	
	const [rooms, setRooms] = useState<JSX.Element[]>(GenerateRoomListJSX())
	_setRooms = setRooms
	
	return (
		<div style={{overflowY: "scroll", overflowX: "hidden", width: "3.5cm", fontSize: ".45cm", height: "5cm"}}>
			{rooms}
		</div>
	)
}
