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
			Password: <input id="_RoomPassword" type="password" /><br />
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
					HTTP.asyncPost(`chat/room`,
						{	OwnerID:User.ID,
							Name:name,
							HasPassword:(pass!=""?"t":"f"),
							Password:(pass!=""?pass:""),
							RoomType:(type?"Private":"Public")},
						null,
						async ok => {
							await ChatUser.asyncUpdate(ChatUser.ID)
							await ChatRoom.asyncUpdate(ok.responseText)
							if (ChatRoom.ID !== "")
								SetMainWindow("chat")
						}, err => setDisanled(false)
					)
				}}
				>Make new room</button>
		</div>
	)
}
