import { useState } from "react";
import { ChangeMemberWindow } from "./MembersWindow";
import ChatRoom from "../../../Downloadable/ChatRoom";
import NameStorage from "../../../Downloadable/NameStorage";
import User from "../../../Downloadable/User";
import HTTP from "../../../HTTP";

export async function asyncUpdateAddFriendList() {
	if (!_setFriends)
		return
	
	_setFriends(GenerateAddFriendJSX())
}

function GenerateAddFriendJSX(): JSX.Element[] {
	const filtered = User.Friends.filter(
		friendID => !ChatRoom.MemberIDs.includes(friendID))
	
	return filtered.map(friendID => 
		ChatRoom.BanIDs.includes(friendID)
		?
		<><button
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
			disabled
			>{"Banned: "}{NameStorage.GetUser(friendID)}</button><br/></>
		:
		<><button
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
			onClick={async () => { await HTTP.asyncPost(`/chat/room/${ChatRoom.ID}/${friendID}`) }}
			>{NameStorage.GetUser(friendID)}</button><br/></>
	)
}

var _setFriends: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null

export default function AddFriend() {
	
	const [friends, setFriends] = useState<JSX.Element[]>(GenerateAddFriendJSX())
	_setFriends = setFriends
	
	if (ChatRoom.ID === "")
		return <></>
	
	return (
	<>
		<div style={{width: "100%", display: "table"}}>
			<button
				style={{height: ".5cm", boxSizing: "border-box"}}
				onClick={() => ChangeMemberWindow("members")}
				>Back</button> Add Friend
		</div>
		
		<div style={{overflowY: "scroll", overflowX: "hidden", width: "3.5cm", fontSize: ".45cm", height: "5cm"}}>
			{friends}
		</div>
	</>
	)
}
