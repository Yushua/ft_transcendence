import { useState } from "react";
import { ChangeMemberWindow, asyncUpdateMembersWindow } from "./MembersWindow";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import User from "../../../../Utils/Cache/User";
import HTTP from "../../../../Utils/HTTP";
import { Button } from "@mui/material";

export async function asyncUpdateAddFriendList() {
	if (!!_setFriends)
		_setFriends(GenerateAddFriendJSX())
}

function GenerateAddFriendJSX(): JSX.Element[] {
	return User.Friends
		.filter(friendID => !ChatRoom.MemberIDs.includes(friendID))
		.map(friendID => 
			ChatRoom.BanIDs.includes(friendID)
			?
			<div key={friendID}>
				<img
					src={HTTP.HostRedirect() + NameStorage.UserPFP.Get(friendID)}
					style={{width: ".5cm", height: ".5cm", borderRadius: "50%"}}
				/>
				<Button variant="outlined"
					style={{height: ".5cm", width: "80%", textAlign: "left", fontSize: ".35cm"}}
					disabled
					>{"[ Banned ]"}</Button></div>
			:
			<div key={friendID}>
				<img
					src={HTTP.HostRedirect() + NameStorage.UserPFP.Get(friendID)}
					style={{width: ".5cm", height: ".5cm", borderRadius: "50%"}}
				/>
				<Button variant="outlined"
					style={{height: ".5cm", width: "80%", textAlign: "left", fontSize: ".35cm"}}
					onClick={async () => { await HTTP.asyncPatch(`chat/room/${ChatRoom.ID}/${friendID}`) }}
					>{NameStorage.User.Get(friendID)}</Button></div>
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
			<Button variant="contained"
				style={{height: ".5cm", boxSizing: "border-box"}}
				onClick={() => ChangeMemberWindow("members")}
				>Back</Button> Add Friend
		</div>
		
		<div style={{overflowY: "scroll", overflowX: "hidden", width: "5cm", fontSize: ".45cm", height: "5cm"}}>
			{friends}
		</div>
	</>
	)
}
