import { useState } from "react";
import MembersWindow, { ChangeMemberWindow, asyncUpdateMembersWindow } from "./MembersWindow";
import NameStorage from "../../../Cache/NameStorage";
import ChatRoom from "../../../Cache/ChatRoom";
import ChatUser from "../../../Cache/ChatUser";
import HTTP from "../../../Utils/HTTP";

export function setMemberProfileID(userID: string) {
	_memberProfileID = userID
}
var _memberProfileID: string = "";

function Mute() {
	var time: string | null = ""
	var actualTime: number = 0
	var mult: string | null = ""
	while (true) {
		time = prompt(`Mute ${NameStorage.GetUser(_memberProfileID)} for how long?`)
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
							onClick={Mute}
							>Mute</button>
						<button
							style={{width: "33%", height: ".5cm", boxSizing: "border-box"}}
							onClick={() => {
								if (window.confirm(`Kick ${NameStorage.GetUser(_memberProfileID)}?`))
									HTTP.asyncDelete(`chat/member/${ChatRoom.ID}/${_memberProfileID}`)
							}}
							>Kick</button>
						<button
							style={{width: "33%", height: ".5cm", boxSizing: "border-box"}}
							onClick={() => {
								if (window.confirm(`Ban ${NameStorage.GetUser(_memberProfileID)}?`))
									HTTP.asyncDelete(`chat/ban/${ChatRoom.ID}/${_memberProfileID}`)
							}}
							>Ban</button>
					</div>
					<div style={{width: "100%", display: "table"}}>
						<button
							style={{width: "100%", height: ".5cm", boxSizing: "border-box"}}
							onClick={() => {
								if (window.confirm(`Make ${NameStorage.GetUser(_memberProfileID)} admin?`))
									HTTP.asyncPatch(`chat/admin/${ChatRoom.ID}/${_memberProfileID}`)
							}}
							>Make Admin</button>
					</div>
				</>
				:
				<></>
			}
		</>
	)
}
