import { useState } from "react"
import HTTP from "../../Utils/HTTP"
import ChatUser from "../../Cache/ChatUser"
import ChatRoom from "../../Cache/ChatRoom"
import { SetMainWindow } from "../MainChatWindow"

function _tryJoiningRoom(roomID: string, hasPass: boolean) {
	var password: string | null = ""
	if (hasPass) {
		while (password === "") {
			password = prompt("Enter password:")
			if (password == null)
				return
		}
	}
	else
		password = "nothing"
	HTTP.asyncPatch(`chat/join/${roomID}/${ChatUser.ID}/${password}`, null, null, async mgs => {
		if (mgs.responseText === "") {
			alert("Faild to join room.")
			return
		}
		await ChatUser.asyncUpdate(ChatUser.ID)
		await ChatRoom.asyncUpdate(roomID)
		SetMainWindow("chat")
	})
}

async function _updateRooms() {
	SetRoom( [<>Loading...</>] )
	HTTP.asyncGet("chat/public", null, null, 
		async mgs => {
			const rooms = (await JSON.parse(mgs.responseText))
				.filter((room: any) => !ChatUser.ChatRoomsIn.includes(room.ID))
				.map((room: any) => (
				<button
					disabled={room.BanIDs.includes(ChatUser.ID)}
					style={{width: "100%"}}
					onClick={() => _tryJoiningRoom(room.ID, room.HasPassword)}
					>{room.BanIDs.includes(ChatUser.ID) ? "[ Banned ] " : ""}{room.HasPassword ? "[ Has Password ] " : ""}{room.Name}</button>
			))
			if (rooms.length === 0)
				SetRoom( [<>No rooms to join.</>] )
			else
				SetRoom(rooms)
		},
		() => SetRoom( [<>Connection Error.</>] ))
}

function SetRoom(data: JSX.Element[]) {
	if (!!_setRooms)
		_setRooms(data)
}
var _setRooms: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null

export default function RoomBrowser() {
	
	const [rooms, setRooms] = useState<JSX.Element[]>([])
	_setRooms = setRooms
	
	if (rooms.length === 0) {
		_updateRooms()
		return <></>
	}
	
	return (
		<div style={{display: "table-cell", width: "100%"}}>
			<button
				style={{height: ".5cm", fontSize: ".35cm"}}
				onClick={_ => _updateRooms()}
				>Refresh</button>
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "100%", fontSize: ".45cm", height: "5cm"}}>
				{rooms}
			</div>
		</div>
	)
}
