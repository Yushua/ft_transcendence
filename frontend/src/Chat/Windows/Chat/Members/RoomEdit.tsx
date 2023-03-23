import { useState } from "react";
import { ChangeMemberWindow, asyncUpdateMembersWindow } from "./MembersWindow";
import User from "../../../../Utils/Cache/User";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import HTTP from "../../../../Utils/HTTP";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import OurHistory from "../../../../Utils/History";
import { Button, Checkbox } from "@mui/material";

export default function RoomEdit() {
	
	const [name, setName] = useState<string>(ChatRoom.Name)
	const [pass, setPass] = useState<string>("")
	const [newPass, setNewPass] = useState<boolean>(false)
	const [priv, setPriv] = useState<boolean>(ChatRoom.Private)
	const [dis, setDis] = useState<boolean>(false)
	
	return (
		<>
			<div style={{width: "100%", display: "table"}}>
				<Button variant="contained"
					style={{height: ".5cm", boxSizing: "border-box"}}
					onClick={() => ChangeMemberWindow("members")}
					>Back</Button> Edit Room
			</div>
			
			New Room Name <input id="_RoomName" style={{width: "100%", boxSizing: "border-box"}} type="text" value={name} onChange={data => setName(data.target.value)} disabled={dis}/><br />
			
			New Password?
				<Checkbox checked={newPass} onChange={event => setNewPass(event.target.checked)} sx={{width: ".5cm", height: ".5cm", transform: "scale(.75)"}}/>
				<input id="_RoomPassword" style={{width: "100%", boxSizing: "border-box"}} type="password" value={pass} onChange={data => setPass(data.target.value)} disabled={!newPass || dis}/><br />
			<Button variant={priv ? "contained" : "outlined"}
					style={{height: ".5cm"}}
					onClick={() => setPriv(!priv)}
					>{priv ? "Private" : "Public"}</Button><br />
			<Button variant="contained"
				disabled={dis}
				onClick={() => {
					if (User.ID === "")
						return
					setDis(true)
					HTTP.asyncPatch(`chat/room/${ChatRoom.ID}`,
						{	OwnerID:User.ID,
							Name:name,
							HasPassword:(newPass?'t':'f'),
							Password:(newPass?pass:''),
							RoomType:(priv?"Private":"Public")},
						null,
						ok => {
							if (name != ChatRoom.Name)
								NameStorage.Room.Clear(ChatRoom.ID)
							ChatRoom.asyncUpdate(ChatRoom.ID)
						},
						err => setDis(false)
					)
				}}
				>Update</Button>
			<br />
			<br />
			<Button variant="contained"
				disabled={dis}
				onClick={() => {
					if (User.ID === ""
						|| !window.confirm(`Are you sure you want to delete room ${ChatRoom.Name}?`)
						|| !window.confirm(`Are you REALLY sure? Room ${ChatRoom.Name} will be deleted FOR EVER.`))
						return
					HTTP.Delete(`chat/room/${ChatRoom.ID}`)
					ChatRoom.Clear()
					OurHistory.Add()
				}}
				color="error"
				>Delete Room</Button>
		</>
	)
}
