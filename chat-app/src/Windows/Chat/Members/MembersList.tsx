import { useState } from "react";
import { ChangeMemberWindow } from "./MembersWindow";
import ChatRoom from "../../../Downloadable/ChatRoom";
import NameStorage from "../../../Downloadable/NameStorage";

export async function asyncUpdateMemberList() {
	if (!_setMembers)
		return
	
	_setMembers(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatRoom.MemberIDs.map(memberID => {
		return (<><button
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
			onClick={() => ChangeMemberWindow(memberID)}>
				{NameStorage.GetUser(memberID)}</button><br/></>)
	})
}

var _setMembers: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null

export default function MembersList() {
	
	const [members, setMembers] = useState<JSX.Element[]>(GenerateRoomListJSX())
	_setMembers = setMembers
	
	if (ChatRoom.ID === "")
		return <></>
	
	if (ChatRoom.Direct)
		return (
		<>
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "3.5cm", fontSize: ".45cm", height: "5.5cm"}}>
				{members}
			</div>
		</>
		)
	else
		return (
		<>
			<div style={{display: "table", width: "100%"}}>
				<button style={{width: "50%", height: ".5cm"}}
					onClick={() => ChangeMemberWindow("edit")}>Edit</button>
				<button style={{width: "50%", height: ".5cm"}}
					onClick={() => ChangeMemberWindow("add")}>Add</button>
			</div>
			
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "3.5cm", fontSize: ".45cm", height: "5cm"}}>
				{members}
			</div>
		</>
		)
}
