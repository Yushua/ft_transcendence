import React, { useState } from "react";
import HTTP from "../HTTP";
import ChatWindow from "./ChatWindow";
import FriendsList from "./FriendsList";
import MembersList from "./MembersList";
import RoomList from "./RoomList";

export function ChangeRoom(roomID: string) {
	
}

export default function MainChatWindow(props: any) {
	var onSelectCallBack: (userID: string) => void = props.onSelectCallBack
	
	return (
		<>
			<FriendsList/>
			<RoomList/>
			<ChatWindow/>
			<MembersList/>
		</>
	)
}
