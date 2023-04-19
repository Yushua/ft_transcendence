import { useState } from "react"
import HTTP from "../../../Utils/HTTP"
import ChatUser from "../../../Utils/Cache/ChatUser"
import { ChatLineHeight, SetMainChatWindow, asyncChangeRoom } from "../MainChatWindow"
import { Button } from "@mui/material"

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
	
	HTTP.asyncPatch(`chat/join/${roomID}/${password}`, null, null,
		async ok => {
			await ChatUser.asyncUpdate(ChatUser.ID)
			SetMainChatWindow("chat")
			asyncChangeRoom(roomID)},
		async error => {
			if (error.status === 403)
				alert((await JSON.parse(error.responseText)).message)
		})
}

var _updating = false // No clue why it's needed, but it fixes it
function _updateRooms() {
	if (_updating)
		return
	_updating = true
	SetRoom( [<div key={"l"}>Loading...</div>] )
	HTTP.asyncGet("chat/public", null, null, 
		async mgs => {
			const rooms = (await JSON.parse(mgs.responseText))
				.filter((room: any) => !ChatUser.ChatRoomsIn.includes(room.ID))
				.map((room: any) => (
				<Button variant="outlined"
					key={room.ID}
					disabled={room.BanIDs.includes(ChatUser.ID)}
					sx={{height: `${ChatLineHeight}px`, width: "100%"}}
					onClick={() => _tryJoiningRoom(room.ID, room.HasPassword)}
					>{room.BanIDs.includes(ChatUser.ID) ? "[ Banned ] " : ""}{room.HasPassword ? "[ Has Password ] " : ""}{room.Name}</Button>
			))
			if (rooms.length === 0)
				SetRoom( [<div key={"n"}>No rooms to join.</div>] )
			else
				SetRoom(rooms)
			_updating = false
		},
		() => {
			SetRoom( [<div key={"c"}>Connection Error.</div>] )
			_updating = false
		})
}

function SetRoom(data: JSX.Element[]) {
	if (!!_setRooms)
		_setRooms(data)
}
var _setRooms: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null

export default function RoomBrowser() {
	
	const [rooms, setRooms] = useState<JSX.Element[]>([])
	_setRooms = setRooms
	
	if (rooms.length === 0)
		_updateRooms()
	
	return (
		<div style={{display: "table-cell", width: "100%", color: "black"}}>
			<br />
			<Button
				variant="text"
				sx={{height: `${ChatLineHeight}px`}}
				onClick={_ => _updateRooms()}
				>Refresh</Button>
			<div style={{width: "100%"}}>
				{rooms}
			</div>
		</div>
	)
}
