import React, { useState } from "react";
import HTTP from "../../../Utils/HTTP";
import ChatUser from "../../../Cache/ChatUser";
import ChatRoom from "../../../Cache/ChatRoom";
import NameStorage from "../../../Cache/NameStorage";
import { asyncChangeRoom } from "../../MainChatWindow";

export async function asyncUpdateRoomList() {
	if (!_setRooms)
		return
	
	_setRooms(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatUser.ChatRoomsIn.map(roomID => {
		if (ChatRoom.ID === roomID)
			return (<><button
				style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
				disabled
				>{NameStorage.GetRoom(roomID)}</button><br/></>)
		else
			return (<><button
				style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
				onClick={_ => asyncChangeRoom(roomID)}
				>{NameStorage.GetRoom(roomID)}</button><br/></>)
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
