import React, { useState } from "react";
import HTTP from "../../HTTP";
import ChatUser from "../../Downloadable/ChatUser";
import ChatRoom from "../../Downloadable/ChatRoom";
import NameStorage from "../../Downloadable/NameStorage";
import { asyncChangeRoom, SetMainWindow } from "../MainChatWindow";
import User from "../../Downloadable/User";

export default function RoomCreation() {
	
	return (
		<div style={{border: "solid"}}>
			Room name: <input id="_RoomName" type="text" /><br />
			Password: <input id="_RoomPassword" type="text" /><br />
			Private: <input id="_RoomType" type="checkbox" /><br />
			<button onClick={() => {
				if (User.ID === "")
					return
				const name: string = (document.getElementById("_RoomName") as HTMLInputElement).value
				const pass: string = (document.getElementById("_RoomPassword") as HTMLInputElement).value
				const type: boolean = (document.getElementById("_RoomType") as HTMLInputElement).checked
				HTTP.asyncPost(`chat/room`, {OwnerID:User.ID, Name:name, Password:pass, RoomType:(type?"Private":"Public")}, null, async function() {
					await ChatUser.asyncDownload(ChatUser.ID)
					await ChatRoom.asyncDownload(this.responseText)
					if (ChatRoom.ID !== "")
						SetMainWindow("chat")
				})
			}}>Make new room</button>
		</div>
	)
}
