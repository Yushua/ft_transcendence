import React, { useState } from "react";
import ChatUser from "../../../../Utils/Cache/ChatUser";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import { ChatLineHeight, ChatWindowHeight, asyncChangeRoom } from "../../MainChatWindow";
import { Button } from "@mui/material";
import ButtonAsyncText from "../../../../Utils/ButtonAsyncText";

export async function asyncUpdateRoomList() {
	if (!!_setRooms)
		_setRooms(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatUser.ChatRoomsIn.map(roomID => <div key={roomID}>
		<ButtonAsyncText
			variant={roomID == ChatRoom.ID ? "contained" : "text"}
			style={{height: `${ChatLineHeight}px`, width: "100%", textAlign: "left"}}
			onClick={() => asyncChangeRoom(roomID)}
			asyncText={() => NameStorage.Room.asyncGet(roomID)}
		/></div>
	)
}
// {NameStorage.Room.Get(roomID)}

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
		<div style={{overflowY: "scroll", overflowX: "hidden", width: "100%", height: `${ChatWindowHeight * .93}px`}}>
			{rooms}
		</div>
	)
}
