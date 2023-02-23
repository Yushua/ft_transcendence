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
		<div style={{display: "table-cell", width: "3.5cm"}}>
			<div>
				<button style={{width: "50%", height: ".5cm"}}
					onClick={() => setDisplay("friend")}>Friends</button>
				<button style={{width: "50%", height: ".5cm"}}
					onClick={() => setDisplay("room")}>Rooms</button>
			</div>
			{window}
		</div>
	)
}
