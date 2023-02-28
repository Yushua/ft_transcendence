import React, { useState } from "react";
import HTTP from "../../../Utils/HTTP";
import ChatUser from "../../../Utils/Cache/ChatUser";
import ChatRoom from "../../../Utils/Cache/ChatRoom";
import { SetMainWindow } from "../MainChatWindow";
import User from "../../../Utils/Cache/User";

export default function RoomCreation() {
	
	const [disabled, setDisanled] = useState<boolean>(false)
	
	return (
		<div style={{border: "solid", width: "8cm"}}>
			Room name: <input id="_RoomName" type="text" /><br />
			Password: <input id="_RoomPassword" type="text" /><br />
			Private: <input id="_RoomType" type="checkbox" /><br />
			<button
				disabled={disabled}
				onClick={() => {
					if (User.ID === "")
						return
					setDisanled(true)
					const name: string = (document.getElementById("_RoomName") as HTMLInputElement).value
					const pass: string = (document.getElementById("_RoomPassword") as HTMLInputElement).value
					const type: boolean = (document.getElementById("_RoomType") as HTMLInputElement).checked
					HTTP.asyncPost(`chat/room`, {OwnerID:User.ID, Name:name, Password:pass, RoomType:(type?"Private":"Public")}, null, async msg => {
						await ChatUser.asyncUpdate(ChatUser.ID)
						await ChatRoom.asyncUpdate(msg.responseText)
						if (ChatRoom.ID !== "")
							SetMainWindow("chat")
					}, () => setDisanled(false))
				}}
				>Make new room</button>
		</div>
	)
}
