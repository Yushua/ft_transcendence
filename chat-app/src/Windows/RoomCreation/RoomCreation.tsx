import React, { useState } from "react";
import HTTP from "../../Utils/HTTP";
import ChatUser from "../../Cache/ChatUser";
import ChatRoom from "../../Cache/ChatRoom";
import { SetMainWindow } from "../MainChatWindow";
import User from "../../Cache/User";

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
					HTTP.asyncPost(`chat/room`, {OwnerID:User.ID, Name:name, Password:pass, RoomType:(type?"Private":"Public")}, null, async function() {
						await ChatUser.asyncUpdate(ChatUser.ID)
						await ChatRoom.asyncUpdate(this.responseText)
						if (ChatRoom.ID !== "")
							SetMainWindow("chat")
					}, () => setDisanled(false))
				}}
				>Make new room</button>
		</div>
	)
}
