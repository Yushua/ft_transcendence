import { useState } from "react"
import FriendsList from "./FriendsList"
import RoomList from "./RoomList"
import ChatRoom from "../../../../Utils/Cache/ChatRoom"
import { Button, Tab, Tabs } from "@mui/material"

export function UpdateRoomSelectWindowButtons() {
	if (!!_setDisplay)
		_setDisplay(ChatRoom.Direct ? "friend" : "room")
}
var _setDisplay: React.Dispatch<React.SetStateAction<string>> = null

export default function RoomSelectWindow() {
	
	// If chat room is alredy open, upon return, open correct window
	const [display, setDisplay] = useState<string>(ChatRoom.Direct ? "friend" : "room")
	_setDisplay = setDisplay
	
	var window
	switch (display) {
		case "friend": window = <FriendsList/>; break
		case "room": window = <RoomList/>; break
		default:
			return <></>
	}
	
	return (
		<div style={{display: "table-cell", width: "5cm"}}>
			<div style={{display: "table", width: "100%"}}>
				<Button
					style={{width: "50%", height: ".5cm"}}
					onClick={() => setDisplay("friend")}
					variant={display==="friend" ? "outlined" : "text"}
					>Friends</Button>
				<Button
					style={{width: "50%", height: ".5cm"}}
					onClick={() => setDisplay("room")}
					variant={display==="room" ? "outlined" : "text"}
					>Rooms</Button>
			</div>
			{window}
		</div>
	)
}
