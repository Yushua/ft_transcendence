import { useState } from "react";
import { ChangeMemberWindow, asyncUpdateMembersWindow } from "./MembersWindow";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import User from "../../../../Utils/Cache/User";

export async function asyncUpdateMemberList() {
	if (!!_setMembers)
		_setMembers(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatRoom.MemberIDs.map(memberID => {
		return (<div key={memberID}><button
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
			onClick={() => ChangeMemberWindow(memberID)}>
				{NameStorage.User.Get(memberID)}</button></div>)
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
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "3.5cm", fontSize: ".45cm", height: "5.5cm"}}>
				{members}
			</div>
		</>
		)
	}
	else
		return (
		<>
			<div style={{display: "table", width: "100%"}}>
				{User.ID === ChatRoom.OwnerID ? <button style={{width: "50%", height: ".5cm"}}
					onClick={() => ChangeMemberWindow("edit")}>Edit</button> : <></>}
				<button style={{width: "50%", height: ".5cm"}}
					onClick={() => ChangeMemberWindow("add")}>Add</button>
			</div>
			
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "3.5cm", fontSize: ".45cm", height: "5cm"}}>
				{members}
			</div>
		</>
		)
}
