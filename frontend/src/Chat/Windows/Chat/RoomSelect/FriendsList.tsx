import React, { useState } from "react";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import ChatUser from "../../../../Utils/Cache/ChatUser";
import User from "../../../../Utils/Cache/User";
import HTTP from "../../../../Utils/HTTP";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import { ChatLineHeight, ChatWindowHeight, asyncChangeRoom } from "../../MainChatWindow";
import { Button } from "@mui/material";

export async function asyncUpdateFriendsList() {
	if (!!_setFriends)
		_setFriends(GenerateFriedListJSX())
}

function GenerateFriedListJSX(): JSX.Element[] {
	return User.Friends.map(friendID => <div key={friendID}>
		<Button 
			variant={ChatRoom.IsRoomOfFriend(friendID) ? "contained" : "text"}
			id={friendID}
			style={{height: `${ChatLineHeight}px`, width: "100%", textAlign: "left"}}
			onClick={_ => _changeToFriendRoom(friendID)}
		>{NameStorage.User.Get(friendID)}</Button></div>
	)
}

async function _changeToFriendRoom(friendID: string) {
	const index = ChatUser.FriedsWithDirect.indexOf(friendID)
	if (index >= 0)
		asyncChangeRoom(ChatUser.DirectChatsIn[index])
	else
		HTTP.asyncPost(`chat/direct/${friendID}`, null, null, async msg => {
			await ChatUser.asyncUpdate(ChatUser.ID)
			asyncChangeRoom(msg.responseText)
		})
}

var _setFriends: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null
var _firstRender = true
export default function FriendsList() {
	
	const [friends, setFriends] = useState<JSX.Element[]>(GenerateFriedListJSX())
	_setFriends = setFriends
	
	if (_firstRender) {
		_firstRender = false
		ChatRoom.UpdateEvent.Subscribe(asyncUpdateFriendsList)
		ChatRoom.ClearEvent.Subscribe(asyncUpdateFriendsList)
		ChatUser.UpdateEvent.Subscribe(asyncUpdateFriendsList)
		ChatUser.ClearEvent.Subscribe(asyncUpdateFriendsList)
	}
	
	return (
		<div style={{overflowY: "scroll", overflowX: "hidden", width: "100%", height: `${ChatWindowHeight * .94}px`}}>
			{friends}
		</div>
	)
}
