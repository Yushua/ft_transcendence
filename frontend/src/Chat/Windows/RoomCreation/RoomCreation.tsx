import { useState } from "react";
import HTTP from "../../../Utils/HTTP";
import ChatUser from "../../../Utils/Cache/ChatUser";
import { ChatLineHeight, SetMainChatWindow, asyncChangeRoom } from "../MainChatWindow";
import User from "../../../Utils/Cache/User";
import { Button, TextField } from "@mui/material";

export default function RoomCreation() {
	
	const [name, setName] = useState<string>("")
	const [pass, setPass] = useState<string>("")
	const [priv, setPriv] = useState<boolean>(false)
	const [dis, setDis] = useState<boolean>(false)
	
	return (
		<>
			<br />
			<TextField sx={{backgroundColor: "white"}}
				label="Room Name" type="text" variant="filled"
				value={name} onChange={e => setName(e.target.value)}/><br />
			<TextField sx={{backgroundColor: "white"}}
				label="Password" type="password" variant="filled"
				value={pass} onChange={e => setPass(e.target.value)}/><br />
			<Button variant={priv ? "contained" : "outlined"}
					sx={{mt: `${ChatLineHeight / 4}px`}}
					onClick={() => setPriv(!priv)}
					>{priv ? "Private" : "Public"}</Button><br />
			<Button variant="contained"
				sx={{mt: `${ChatLineHeight / 4}px`}}
				disabled={dis}
				onClick={() => {
					if (User.ID === "")
						return
					setDis(true)
					HTTP.asyncPost(`chat/room`,
						{	OwnerID:User.ID,
							Name:name,
							HasPassword:(pass!=""?"t":"f"),
							Password:(pass!=""?pass:""),
							RoomType:(priv?"Private":"Public")},
						null,
						async ok => {
							await ChatUser.asyncUpdate(ChatUser.ID)
							SetMainChatWindow("chat")
							asyncChangeRoom(ok.responseText)
						}, err => setDis(false)
					)
				}}
				>Make new room</Button>
		</>
	)
}
