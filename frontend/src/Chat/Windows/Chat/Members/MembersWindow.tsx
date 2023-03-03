import { useState } from "react"
import MembersList from "./MembersList"
import MemberProfile, { setMemberProfileID } from "./MemberProfile"
import RoomEdit from "./RoomEdit"
import AddFriend from "./AddFriend"
import ChatRoom from "../../../../Utils/Cache/ChatRoom"
import ChatUser from "../../../../Utils/Cache/ChatUser"

export async function asyncUpdateMembersWindow() {
	if (ChatRoom.ID !== "" && ChatRoom.Direct)
		ChangeMemberWindow(ChatRoom.MemberIDs.find(userID => userID !== ChatUser.ID) ?? ChatUser.ID)
	else
		ChangeMemberWindow("members")
}

export function ChangeMemberWindow(window: string) {
	if (!!_setDisplay)	
		_setDisplay(window)
}

var _setDisplay: React.Dispatch<React.SetStateAction<string>> | null = null
var _firstRender = true
export default function MembersWindow() {
	
	const [display, setDisplay] = useState<string>("members")
	_setDisplay = setDisplay
	
	if (_firstRender) {
		_firstRender = false
		ChatUser.UpdateEvent.Subscribe(asyncUpdateMembersWindow)
		ChatUser.ClearEvent.Subscribe(asyncUpdateMembersWindow)
	}
	
	var window
	switch (display) {
		case "members": window = <MembersList/>; break
		case "edit": window = <RoomEdit/>; break
		case "add": window = <AddFriend/>; break
		default:
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
