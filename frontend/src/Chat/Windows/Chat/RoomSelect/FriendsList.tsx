import React, { useState } from "react";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import ChatUser from "../../../../Utils/Cache/ChatUser";
import User from "../../../../Utils/Cache/User";
import HTTP from "../../../../Utils/HTTP";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import { asyncChangeRoom } from "../../MainChatWindow";

export async function asyncUpdateFriendsList() {
	if (!_setFriends)
		return
	
	_setFriends(GenerateFriedListJSX())
}

function GenerateFriedListJSX(): JSX.Element[] {
	return User.Friends.map(friendID => {
		if (ChatRoom.IsRoomOfFriend(friendID))
			return (<div key={friendID}><button
				id={friendID}
				style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
				disabled
				>{NameStorage.GetUser(friendID)}</button></div>)
		else
			return (<div key={friendID}><button
				id={friendID}
				style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
				onClick={_ => _changeToFriendRoom(friendID)}
				>{NameStorage.GetUser(friendID)}</button></div>)
	})
}

var _setFriends: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null

async function _changeToFriendRoom(friendID: string) {
	const index = ChatUser.FriedsWithDirect.indexOf(friendID)
	if (index >= 0)
		asyncChangeRoom(ChatUser.DirectChatsIn[index])
	else
		HTTP.asyncPost(`chat/direct/${ChatUser.ID}/${friendID}`, null, null, async msg => {
			await ChatUser.asyncUpdate(ChatUser.ID)
			asyncChangeRoom(msg.responseText)
		})
}

export default function FriendsList() {
	
	const [friends, setFriends] = useState<JSX.Element[]>(GenerateFriedListJSX())
	_setFriends = setFriends
	
	return (
		<div style={{overflowY: "scroll", overflowX: "hidden", width: "3.5cm", fontSize: ".45cm", height: "5cm"}}>
			{friends}
		</div>
	)
}
