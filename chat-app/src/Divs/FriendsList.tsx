import React, { useState } from "react";
import ChatRoom from "../Downloadable/ChatRoom";
import ChatUser from "../Downloadable/ChatUser";
import User from "../Downloadable/User";
import HTTP from "../HTTP";
import NameStorage from "../NameStorage";
import { ChangeRoom } from "./MainChatWindow";

export async function asyncUpdateFriendsList() {
	if (!_setFriends)
		return
	for (const userID of User.Friends)
		await NameStorage.asyncGetUser(userID)
	_setFriends(User.Friends)
}

var _setFriends: React.Dispatch<React.SetStateAction<string[]>> | null = null

async function _changeToFriendRoom(friendID: string) {
	const index = ChatUser.FriedsWithDirect.indexOf(friendID)
	if (index >= 0)
		ChangeRoom(ChatUser.DirectChatsIn[index])
	else
		HTTP.asyncPost(`chat/direct/${ChatUser.ID}/${friendID}`, null, null, function() {ChangeRoom(this.responseText)})
}

export default function FriendsList() {
	
	const [friends, setFriends] = useState<string[]>([])
	_setFriends = setFriends
	
	return (
		<>
			<a>
			{friends.map(friendID => {
				if (ChatRoom.IsRoomOfFriend(friendID))
					return (<>{NameStorage.GetUser(friendID)}<br/></>)
				else
					return (<><button onClick={_ => _changeToFriendRoom(friendID)}>{NameStorage.GetUser(friendID)}</button><br/></>)
			})}
			</a>
		</>
	)
}
