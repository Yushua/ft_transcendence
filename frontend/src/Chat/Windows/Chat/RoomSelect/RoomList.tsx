import React, { useState } from "react";
import HTTP from "../../../../Utils/HTTP";
import ChatUser from "../../../../Utils/Cache/ChatUser";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import { asyncChangeRoom } from "../../MainChatWindow";
import { Button } from "@mui/material";

export async function asyncUpdateRoomList() {
	if (!!_setRooms)
		_setRooms(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatUser.ChatRoomsIn.map(roomID => <div key={roomID}>
		<Button
			variant={roomID == ChatRoom.ID ? "contained" : "text"}
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
			onClick={_ => asyncChangeRoom(roomID)}
		>{NameStorage.Room.Get(roomID)}</Button></div>
	)
}

var _setRooms: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null
var _firstRender = true
export default function RoomList() {
	
	const [rooms, setRooms] = useState<JSX.Element[]>(GenerateRoomListJSX())
	_setRooms = setRooms
	
	if (_firstRender) {
		_firstRender = false
		ChatRoom.UpdateEvent.Subscribe(asyncUpdateRoomList)
		ChatRoom.ClearEvent.Subscribe(asyncUpdateRoomList)
		ChatUser.UpdateEvent.Subscribe(asyncUpdateRoomList)
		ChatUser.ClearEvent.Subscribe(asyncUpdateRoomList)
	}
	
	return (
		<div style={{overflowY: "scroll", overflowX: "hidden", width: "5cm", fontSize: ".45cm", height: "5cm"}}>
			{rooms}
		</div>
	)
}
