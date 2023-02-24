import { useState } from "react"
import FriendsList from "./FriendsList"
import RoomList from "./RoomList"
import ChatRoom from "../../../Cache/ChatRoom"

export default function RoomSelectWindow() {
	
	// If chat room is alredy open, upon return, open correct window
	const [display, setDisplay] = useState<string>(ChatRoom.Direct ? "friend" : "room")
	
	var window
	switch (display) {
		case "friend": window = <FriendsList/>; break
		case "room": window = <RoomList/>; break
		default:
			return <></>
	}
	
	return (
		<div style={{display: "table-cell", width: "3.5cm"}}>
			<div style={{display: "table", width: "100%"}}>
				<button
					style={{width: "50%", height: ".5cm"}}
					onClick={() => setDisplay("friend")}
					disabled={display === "friend"}
					>Friends</button>
				<button
					style={{width: "50%", height: ".5cm"}}
					onClick={() => setDisplay("room")}
					disabled={display === "room"}
					>Rooms</button>
			</div>
			{window}
		</div>
	)
}
