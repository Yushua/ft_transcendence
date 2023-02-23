import { useState } from "react"
import FriendsList from "./FriendsList"
import RoomList from "./RoomList"

export default function RoomSelectWindow() {
	
	const [display, setDisplay] = useState<string>("friend")
	
	var window
	switch (display) {
		case "friend": window = <FriendsList/>; break
		case "room": window = <RoomList/>; break
		default:
			return <></>
	}
	
	return (
		<div style={{width: "100px", display: "table-cell", border: "solid"}}>
			<div>
				<button style={{display: "table-cell"}} onClick={() => setDisplay("friend")}>F</button>
				<button style={{display: "table-cell"}} onClick={() => setDisplay("room")}>R</button>
			</div>
			{window}
		</div>
	)
}
