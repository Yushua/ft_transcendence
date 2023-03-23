import { useState } from "react";
import { ChangeMemberWindow, asyncUpdateMembersWindow } from "./MembersWindow";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import User from "../../../../Utils/Cache/User";
import HTTP from "../../../../Utils/HTTP";
import OurHistory from "../../../../Utils/History";
import { Button } from "@mui/material";

export async function asyncUpdateMemberList() {
	if (!!_setMembers)
		_setMembers(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatRoom.MemberIDs.map(memberID => {
		return (<div key={memberID}>
			<img
				src={HTTP.HostRedirect() + NameStorage.UserPFP.Get(memberID)}
				style={{width: ".5cm", height: ".5cm", borderRadius: "50%"}}
			/>
			<Button variant="contained"
			style={{height: ".5cm", width: "80%", textAlign: "left", fontSize: ".35cm"}}
			onClick={() => ChangeMemberWindow(memberID)}>
				{NameStorage.User.Get(memberID)}</Button>
		</div>)
	})
}

var _setMembers: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null
var _firstRender = true
export default function MembersList() {
	
	const [members, setMembers] = useState<JSX.Element[]>(GenerateRoomListJSX())
	_setMembers = setMembers
	
	if (_firstRender) {
		_firstRender = false
		ChatRoom.UpdateEvent.Subscribe(asyncUpdateMemberList)
		ChatRoom.ClearEvent.Subscribe(asyncUpdateMemberList)
	}
	
	if (ChatRoom.ID === "")
		return <></>
	
	if (ChatRoom.Direct) {
		asyncUpdateMembersWindow()
		return (
		<>
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "5cm", fontSize: ".45cm", height: "5.5cm"}}>
				{members}
			</div>
		</>
		)
	}
	else
		return (
		<>
			<div style={{display: "table", width: "100%"}}>
				{User.ID === ChatRoom.OwnerID
					? <Button variant="outlined" style={{width: "50%", height: ".5cm"}}
						onClick={() => ChangeMemberWindow("edit")}>Edit</Button>
					: <Button variant="outlined" style={{width: "50%", height: ".5cm"}}
						onClick={() => {
							HTTP.Delete(`chat/leave/${ChatRoom.ID}`)
							OurHistory.Add()
						}}>Leave</Button>}
				<Button  variant="outlined" style={{width: "50%", height: ".5cm"}}
					onClick={() => ChangeMemberWindow("add")}>Add</Button>
			</div>
			
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "5cm", fontSize: ".45cm", height: "5cm"}}>
				{members}
			</div>
		</>
		)
}
