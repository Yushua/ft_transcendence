import { useState } from "react";
import { ChangeMemberWindow, asyncUpdateMembersWindow } from "./MembersWindow";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import User from "../../../../Utils/Cache/User";
import HTTP from "../../../../Utils/HTTP";

export async function asyncUpdateAddFriendList() {
	if (!_setFriends)
		return
	
	_setFriends(GenerateAddFriendJSX())
}

function GenerateAddFriendJSX(): JSX.Element[] {
	return User.Friends
		.filter(friendID => !ChatRoom.MemberIDs.includes(friendID))
		.map(friendID => 
			ChatRoom.BanIDs.includes(friendID)
			?
			<div key={friendID}><button
				style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
				disabled
				>{"Banned: "}{NameStorage.GetUser(friendID)}</button></div>
			:
			<div key={friendID}><button
				style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
				onClick={async () => { await HTTP.asyncPatch(`/chat/room/${ChatRoom.ID}/${friendID}`) }}
				>{NameStorage.GetUser(friendID)}</button></div>
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
