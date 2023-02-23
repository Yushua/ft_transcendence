import React, { useState } from "react";
import ChatRoom from "../Downloadable/ChatRoom";
import ChatUser from "../Downloadable/ChatUser";
import User from "../Downloadable/User";
import HTTP from "../HTTP";
import NameStorage from "../NameStorage";
import { asyncChangeRoom } from "./MainChatWindow";

export async function asyncUpdateFriendsList() {
	if (!_setFriends)
		return
	for (const friendID of User.Friends)
		await NameStorage.GetUser(friendID)
	
	_setFriends(GenerateFriedListJSX())
}

function GenerateFriedListJSX(): JSX.Element[] {
	return User.Friends.map(friendID => {
		if (ChatRoom.IsRoomOfFriend(friendID))
			return (<><div
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".45cm"}}>
				{NameStorage.GetUser(friendID)}</div></>)
		else
			return (<><button
			style={{height: ".5cm", width: "100%", textAlign: "left", fontSize: ".35cm"}}
			onClick={_ => _changeToFriendRoom(friendID)}>
				{NameStorage.GetUser(friendID)}</button><br/></>)
	})
}

var _setFriends: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null

async function _changeToFriendRoom(friendID: string) {
	const index = ChatUser.FriedsWithDirect.indexOf(friendID)
	if (index >= 0)
		asyncChangeRoom(ChatUser.DirectChatsIn[index])
	else
		HTTP.asyncPost(`chat/direct/${ChatUser.ID}/${friendID}`, null, null, async function() {
			await ChatUser.asyncDownload(ChatUser.ID)
			asyncChangeRoom(this.responseText)
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
