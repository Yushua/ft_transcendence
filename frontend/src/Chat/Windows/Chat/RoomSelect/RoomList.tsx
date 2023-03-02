import React, { useState } from "react";
import HTTP from "../../../../Utils/HTTP";
import ChatUser from "../../../../Utils/Cache/ChatUser";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import { asyncChangeRoom } from "../../MainChatWindow";

export async function asyncUpdateRoomList() {
	if (!_setRooms)
		return
	
	_setRooms(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatUser.ChatRoomsIn.map(roomID => {
		if (ChatRoom.ID === roomID)
			return (<div key={roomID}><button
				style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
				disabled
				>{NameStorage.GetRoom(roomID)}</button></div>)
		else
			return (<div key={roomID}><button
				style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
				onClick={_ => asyncChangeRoom(roomID)}
				>{NameStorage.GetRoom(roomID)}</button></div>)
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