import { useState } from "react";
import { ChangeMemberWindow } from "./MembersWindow";
import NameStorage from "../../../Downloadable/NameStorage";
import ChatRoom from "../../../Downloadable/ChatRoom";
import ChatUser from "../../../Downloadable/ChatUser";
import HTTP from "../../../HTTP";

export function setMemberProfileID(userID: string) {
	_memberProfileID = userID
}
var _memberProfileID: string = "";

export default function MemberProfile() {
	
	return (
		<>
			{ ChatRoom.Direct ? <></> :
				<div style={{width: "100%", display: "table"}}>
					<button
						style={{height: ".5cm", boxSizing: "border-box"}}
						onClick={() => ChangeMemberWindow("members")}
						>Back</button> ProfileView
				</div>
			}
			
			{/* Username */}
			<div style={{width: "100%", display: "table"}}>
				<div style={{textAlign: "left"}}>{NameStorage.GetUser(_memberProfileID)}</div>
			</div>
			
			<div style={{width: "100%", display: "table"}}>
				<button
					style={{width: "100%", height: ".5cm", boxSizing: "border-box"}}
					onClick={() => {}}
					>View Profile</button>
			</div>
			<div style={{width: "100%", display: "table"}}>
				<button
					style={{width: "100%", height: ".5cm", boxSizing: "border-box"}}
					onClick={() => {}}
					>Block</button>
			</div>
			
			{/* Admin Options */}
			{ (ChatRoom.AdminIDs.includes(ChatUser.ID) && !ChatRoom.AdminIDs.includes(_memberProfileID)) ?
				<>
					<div style={{width: "100%", display: "table"}}>
						<div style={{textAlign: "left"}}>Admin options:</div>
					</div>
					
					<div style={{width: "100%", display: "table"}}>
						<button
							style={{width: "33%", height: ".5cm", boxSizing: "border-box"}}
							onClick={() => {}}
							>Mute</button>
						<button
							style={{width: "33%", height: ".5cm", boxSizing: "border-box"}}
							onClick={() => HTTP.asyncDelete(`chat/member/${ChatRoom.ID}/${_memberProfileID}`)}
							>Kick</button>
						<button
							style={{width: "33%", height: ".5cm", boxSizing: "border-box"}}
							onClick={() => HTTP.asyncDelete(`chat/ban/${ChatRoom.ID}/${_memberProfileID}`)}
							>Ban</button>
					</div>
					<div style={{width: "100%", display: "table"}}>
						<button
							style={{width: "100%", height: ".5cm", boxSizing: "border-box"}}
							onClick={() => HTTP.asyncPost(`chat/admin/${ChatRoom.ID}/${_memberProfileID}`)}
							>Make Admin</button>
					</div>
				</>
				:
				<></>
			}
		</>
	)
}
