import { ChangeMemberWindow } from "./MembersWindow";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import ChatUser from "../../../../Utils/Cache/ChatUser";
import HTTP from "../../../../Utils/HTTP";
import User from "../../../../Utils/Cache/User";
import { Button } from "@mui/material";
import { ChatLineHeight, ChatWindowHeight } from "../../MainChatWindow";
import { ClearChatMessageCache } from "../ActualChat/ChatWindow";
import { CreatingGameData } from "../../../../Games/pong/components/CreateGameMenu";
import { SetWindowProfile } from "../../../../UserProfile/ProfileMainWindow";
import OtherUserProfile from "../../../../UserProfile/ProfilePages/OtherUserProfile";
import { SetMainWindow } from "../../../../MainWindow/MainWindow";

export function setMemberProfileID(userID: string) {
	_memberProfileID = userID
}
var _memberProfileID: string = "";

export function UnblockUser(memberID: string) {
	if (window.confirm(`Are you sure you want to unblock user ${NameStorage.User.Get(memberID)}?`)
		&& window.confirm(`Are you REALLY sure?\nYou porbably blocked this user for a good reason.`))
			HTTP.asyncPatch(`chat/unblock/${memberID}`, null, null, async () => {
				await ChatUser.asyncUpdate(ChatUser.ID)
				ClearChatMessageCache()
			})
}

function Mute() {
	var time: string | null = ""
	var actualTime: number = 0
	var mult: string | null = ""
	while (true) {
		time = prompt(`Mute ${NameStorage.User.Get(_memberProfileID)} for how long?`)
		if (!time)
			return
		if (time.length === 0)
			continue;
		if (Number.isInteger(actualTime = +time)) {
			while (true) {
				switch (mult = prompt(`Mute for ${time} (s)econds, (m)inutes, (h)ours or (d)ays?`)) {
					case "s": case "m": case "h": case "d": break
					case null: return
					default: continue
				}
				break
			}
			break
		}
		mult = time[time.length - 1]
		time = time.substring(0, time.length - 1)
		if (Number.isInteger(actualTime = +time)) {
			switch (mult) {
				case "s": case "m": case "h": case "d": break
				default: continue
			}
			break
		}
	}
	switch (mult) {
		case "s": actualTime *= 1000; break
		case "m": actualTime *= 1000 * 60; break
		case "h": actualTime *= 1000 * 60 * 60; break
		case "d": actualTime *= 1000 * 60 * 60 * 24; break
	}
	HTTP.asyncPatch(`chat/mute/${ChatRoom.ID}/${_memberProfileID}/${actualTime}`, null, null,
		() => ChangeMemberWindow("members"),
		async msg => alert((await JSON.parse(msg.responseText))?.message ?? "Error"))
}

export default function MemberProfile() {
	
	const isBlocked = ChatUser.BlockedUserIDs.includes(_memberProfileID)
	
	return (
		<>
			<div style={{width: "100%", display: "table", height: `${ChatWindowHeight * .04}px`}}>
				{ ChatRoom.Direct ? <>ProfileView</> :
					<><Button variant="contained"
						style={{height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
						onClick={() => ChangeMemberWindow("members")}
						>Back</Button> ProfileView</>
				}
			</div>
			
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "100%", height: `${ChatWindowHeight * .94}px`}}>
				{/* Username */}
				<br />
				<img
					src={`${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(_memberProfileID)}`} alt=""
					style={{width: `${ChatLineHeight * 5}px`, height: `${ChatLineHeight * 5}px`, borderRadius: "50%"}}	
				/>
				
				<div style={{width: "100%", display: "table"}}>
					<div>{NameStorage.User.Get(_memberProfileID)}</div>
				</div>
				
				<div style={{width: "100%", display: "table"}}>
					<Button variant="contained"
						style={{width: "100%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
						onClick={() => {
							SetMainWindow("profile", _memberProfileID === User.ID)
        					if (_memberProfileID !== User.ID)
								setTimeout(async () => {
									SetWindowProfile(<OtherUserProfile id={_memberProfileID}/>, true)
								}, 0);
						}}
						>View Profile</Button>
				</div>
				{ !!CreatingGameData.gameID ?
					<div style={{width: "100%", display: "table"}}>
						<Button variant="contained"
							style={{width: "100%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
							onClick={() => {
								if (ChatRoom.Direct)
									HTTP.asyncPost(`chat/invite/${_memberProfileID}`, {id: CreatingGameData.gameID})
								else
									HTTP.asyncPost(`chat/invitegroup/${ChatRoom.ID}`, {id: CreatingGameData.gameID})
							}}
							>Post Pong Invite</Button>
					</div> : <></>
				}
				{ _memberProfileID !== User.ID ?
					(isBlocked ? 
						<div style={{width: "100%", display: "table", marginTop: `${ChatLineHeight/2}px`}}>
							<Button variant="contained"
								style={{width: "100%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
								onClick={() => {
									ChangeMemberWindow("members")
									UnblockUser(_memberProfileID)
								}}
								>Unblock</Button>
						</div>
							:
						<div style={{width: "100%", display: "table", marginTop: `${ChatLineHeight/2}px`}}>
							<Button variant="contained"
								style={{width: "100%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
								onClick={() => {
									if (window.confirm(`Are you sure you want to block user ${NameStorage.User.Get(_memberProfileID)}?\nYou won't be able to see anything they write and private messages will be deleted.`)
										&& window.confirm(`Are you REALLY sure?\nAll private messages with this user will be deleted.`))
											ChangeMemberWindow("members")	
											HTTP.asyncPatch(`chat/block/${_memberProfileID}`, null, null, async () => {
												await ChatUser.asyncUpdate(ChatUser.ID)
												if (ChatRoom.Direct)
													ChatRoom.Clear()
												ClearChatMessageCache()
											})
								}}
								>Block</Button>
						</div>) : <></>
				}
				
				
				{/* Admin Options */}
				{ (ChatRoom.AdminIDs.includes(User.ID) && !ChatRoom.AdminIDs.includes(_memberProfileID)) ?
					<>
						<br />
						<div style={{width: "100%", display: "table"}}>
							<div>Admin Options</div>
						</div>
						
						<div style={{width: "100%", display: "table"}}>
							<Button variant="contained"
								style={{width: "33%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
								onClick={Mute}
								>Mute</Button>
							<Button variant="contained"
								style={{width: "33%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
								onClick={() => {
									ChangeMemberWindow("members")
									if (window.confirm(`Kick ${NameStorage.User.Get(_memberProfileID)}?`))
										HTTP.asyncDelete(`chat/member/${ChatRoom.ID}/${_memberProfileID}`)
								}}
								>Kick</Button>
							<Button variant="contained"
								style={{width: "33%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
								onClick={() => {
									ChangeMemberWindow("members")
									if (window.confirm(`Do you really want to ban ${NameStorage.User.Get(_memberProfileID)}?`)
										&& window.confirm(`Are you REALLY sure?\nThis can't be undone.`))
										HTTP.asyncDelete(`chat/ban/${ChatRoom.ID}/${_memberProfileID}`)
								}}
								>Ban</Button>
						</div>
						<div style={{width: "100%", display: "table"}}>
							<Button variant="contained"
								style={{width: "100%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
								onClick={() => {
									ChangeMemberWindow("members")
									if (window.confirm(`Make ${NameStorage.User.Get(_memberProfileID)} admin?`)
										&& window.confirm(`Are you REALLY sure?`))
										HTTP.asyncPatch(`chat/admin/${ChatRoom.ID}/${_memberProfileID}`)
								}}
								>Make Admin</Button>
						</div>
					</>
					:
					<></>
				}
				
				{/* Owner Options */}
				{ (ChatRoom.OwnerID === User.ID
					&& User.ID !== _memberProfileID
					&& ChatRoom.AdminIDs.includes(_memberProfileID)) ?
					<>
						<br />
						<div style={{width: "100%", display: "table"}}>
							<div>Owner Options</div>
						</div>
						
						<div style={{width: "100%", display: "table"}}>
							<Button variant="contained"
								style={{width: "100%", height: `${ChatLineHeight}px`, boxSizing: "border-box"}}
								onClick={() => {
									ChangeMemberWindow("members")
									if (window.confirm(`Remove admin role from ${NameStorage.User.Get(_memberProfileID)}?`))
										HTTP.asyncDelete(`chat/admin/${ChatRoom.ID}/${_memberProfileID}`)
								}}
								>Remove Admin</Button>
						</div>
					</>
					:
					<></>
				}
			</div>
		</>
	)
}
