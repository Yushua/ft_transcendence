import { useState } from "react"
import MembersList from "./MembersList"
import MemberProfile, { setMemberProfileID } from "./MemberProfile"
import RoomEdit from "./RoomEdit"
import AddFriend from "./AddFriend"
import ChatRoom from "../../../../Utils/Cache/ChatRoom"
import ChatUser from "../../../../Utils/Cache/ChatUser"

export async function asyncUpdateMembersWindow() {
	if (ChatRoom.ID !== "") {
		if (ChatRoom.Direct)
			ChangeMemberWindow(ChatRoom.MemberIDs.find(userID => userID !== ChatUser.ID) ?? ChatUser.ID)
		else
			ChangeMemberWindow("members")
	}
}

export function ChangeMemberWindow(window: string) {
	if (!!_setDisplay)	
		_setDisplay(window)
}

var _setDisplay: React.Dispatch<React.SetStateAction<string>> | null = null

export default function MembersWindow() {
	
	const [display, setDisplay] = useState<string>("members")
	_setDisplay = setDisplay
	
	var window
	switch (display) {
		case "members": window = <MembersList/>; break
		case "edit": window = <RoomEdit/>; break
		case "add": window = <AddFriend/>; break
		default:
			case "profile":
				setMemberProfileID(display)
				window = <MemberProfile/>;
				break
	}
	
	return (
		<div style={{display: "table-cell", width: "3.5cm"}}>
			{window}
		</div>
	)
}
