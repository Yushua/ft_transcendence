import { useState } from "react";
import { ChangeMemberWindow, asyncUpdateMembersWindow } from "./MembersWindow";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import User from "../../../../Utils/Cache/User";
import HTTP from "../../../../Utils/HTTP";
import OurHistory from "../../../../Utils/History";
import { Button } from "@mui/material";
import { ChatLineHeight, ChatWindowHeight } from "../../MainChatWindow";

export async function asyncUpdateMemberList() {
	if (!!_setMembers)
		_setMembers(GenerateRoomListJSX())
}

function GenerateRoomListJSX(): JSX.Element[] {
	return ChatRoom.MemberIDs.map(memberID => {
		return (<div key={memberID}>
			<img
				src={`${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(memberID)}`}
				style={{width: `${ChatLineHeight}px`, height: `${ChatLineHeight}px`, borderRadius: "50%"}}
			/>
			<Button variant="contained"
			style={{height: `${ChatLineHeight}px`, width: "80%", textAlign: "left"}}
			onClick={() => ChangeMemberWindow(memberID)}>
				{NameStorage.User.Get(memberID)}</Button>
		</div>)
	})
}

var _setMembers: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null
var _firstRender = true
export default function MembersList() {
	
	const [members, setMembers] = useState<JSX.Element[]>(GenerateRoomListJSX())
	_setMembers = setMembers
	
	if (_firstRender) {
		_firstRender = false
		ChatRoom.UpdateEvent.Subscribe(asyncUpdateMemberList)
		ChatRoom.ClearEvent.Subscribe(asyncUpdateMemberList)
	}
	
	if (ChatRoom.ID === "")
		return <></>
	
	if (ChatRoom.Direct) {
		asyncUpdateMembersWindow()
		return (
		<>
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "100%", height: `${ChatLineHeight}px`}}>
				{members}
			</div>
		</>
		)
	}
	else
		return (
		<>
			<div style={{display: "table", width: "100%", height: `${ChatWindowHeight * .04}px`}}>
				{User.ID === ChatRoom.OwnerID
					? <Button variant="outlined" style={{width: "50%", height: `${ChatLineHeight}px`}}
						onClick={() => ChangeMemberWindow("edit")}>Edit</Button>
					: <Button variant="outlined" style={{width: "50%", height: `${ChatLineHeight}px`}}
						onClick={() => {
							HTTP.Delete(`chat/leave/${ChatRoom.ID}`)
							OurHistory.Add()
						}}>Leave</Button>}
				<Button  variant="outlined" style={{width: "50%", height: `${ChatLineHeight}px`}}
					onClick={() => ChangeMemberWindow("add")}>Add</Button>
			</div>
			
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "100%", height: `${ChatWindowHeight * .94}px`}}>
				{members}
			</div>
		</>
		)
}
