import { useState } from "react";
import { ChangeMemberWindow, asyncUpdateMembersWindow } from "./MembersWindow";
import User from "../../../../Utils/Cache/User";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import HTTP from "../../../../Utils/HTTP";
import NameStorage from "../../../../Utils/Cache/NameStorage";

export default function RoomEdit() {
	
	const [name, setName] = useState<string>(ChatRoom.Name)
	const [pass, setPass] = useState<string>(ChatRoom.Password)
	const [priv, setPriv] = useState<boolean>(ChatRoom.Private)
	const [dis, setDis] = useState<boolean>(false)
	
	return (
		<>
			<div style={{width: "100%", display: "table"}}>
				<button
					style={{height: ".5cm", boxSizing: "border-box"}}
					onClick={() => ChangeMemberWindow("members")}
					>Back</button> Edit Room
			</div>
			
			Room name: <input id="_RoomName" style={{width: "100%", boxSizing: "border-box"}} type="text" value={name} onChange={data => setName(data.target.value)} disabled={dis}/><br />
			Password: <input id="_RoomPassword" style={{width: "100%", boxSizing: "border-box"}} type="text" value={pass} onChange={data => setPass(data.target.value)} disabled={dis}/><br />
			Private: <input id="_RoomType" type="checkbox" checked={priv} onChange={data => setPriv(data.target.checked)} disabled={dis}/><br />
			<button
				disabled={dis}
				onClick={() => {
					if (User.ID === "")
						return
					setDis(true)
					const name: string = (document.getElementById("_RoomName") as HTMLInputElement).value
					const pass: string = (document.getElementById("_RoomPassword") as HTMLInputElement).value
					const type: boolean = (document.getElementById("_RoomType") as HTMLInputElement).checked
					HTTP.asyncPatch(`chat/room/${ChatRoom.ID}`, {OwnerID:User.ID, Name:name, Password:pass, RoomType:(type?"Private":"Public")}, null, async function() {
						if (name != ChatRoom.Name)
							NameStorage.ClearRoom(ChatRoom.ID)
						ChatRoom.asyncUpdate(ChatRoom.ID)
					}, () => setDis(false))
				}}
				>Update</button>
		</>
	)
}
