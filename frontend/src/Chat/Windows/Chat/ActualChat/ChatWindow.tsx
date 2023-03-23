import React, { useEffect, useMemo, useState } from "react";
import HTTP from "../../../../Utils/HTTP";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import User from "../../../../Utils/Cache/User";
import { Avatar, CardHeader } from "@mui/material";

var roomCache: Map<string, JSX.Element[]> = new Map<string, JSX.Element[]>()
var _chatLog: JSX.Element[] = []
var _logDepth = 30
var _fillDepth = 10
var _oldRoomID = ""

function scrollDown(time: number) {
	var log = document.getElementById("ChatLog") as HTMLElement
	if (!!log)
		setTimeout(() => log.scrollTop = log.scrollHeight, time)
}

export async function asyncUpdateChatLog() {
	if (!_setChatLog)
		return
	if (_oldRoomID !== ChatRoom.ID) {
		if (_oldRoomID !== "")
			roomCache.set(_oldRoomID, _chatLog)
		_oldRoomID = ChatRoom.ID
		_chatLog = roomCache.get(_oldRoomID) ?? []
		if (ChatRoom.ID === "") {
			_setChatLog([<div><span>&#8203;</span></div>])
			return
		}
	}
	
	var _msgCount = _chatLog.length
	
	const newMsgCount = ChatRoom.MessageCount
	
	if (newMsgCount > _msgCount) {
		var newChatLog = []
		var count = 0
		var target = newMsgCount - _msgCount
		
		for (let page = 1; count < target; page++) {
			const msgs = await JSON.parse(HTTP.Get(`chat/msg/${ChatRoom.ID}/-${page}`))
			
			if (msgs.length == 0)
				break
			
			for (let i = msgs.length - 1; count < target && i >= 0; i--) {
				count++
				newChatLog.unshift(
					<div key={count + _msgCount} style={{textAlign: "left"}}>
						{
							<img
								src={HTTP.HostRedirect() + NameStorage.UserPFP.Get(msgs[i].OwnerID)}
								style={{width: ".5cm", height: ".5cm", borderRadius: "50%"}}
							/>
						}
						<b>{`${NameStorage.User.Get(msgs[i].OwnerID)}`}</b>
						{`: ${msgs[i].Message}`}
					</div>
				)
			}
		}
		
		_chatLog = _chatLog.concat(newChatLog)
	}
	
	_msgCount = newMsgCount
	
	var chatLog = _chatLog.map(x=>x)
	for (var fill = _msgCount; fill < _fillDepth; fill++)
		chatLog.unshift(<div key={`fill${fill}`}><span>&#8203;</span></div>)
	
	_setChatLog(chatLog)
	scrollDown(0)
}

var _setChatLog: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null
var _firstRender = true
export default function ChatWindow() {
	
	const [chatLog, setChatLog] = useState<JSX.Element[]>([])
	_setChatLog = setChatLog
	
	if (_firstRender) {
		_firstRender = false
		ChatRoom.ClearEvent.Subscribe(asyncUpdateChatLog)
		ChatRoom.UpdateEvent.Subscribe(asyncUpdateChatLog)
	}
	
	useEffect(() => {
		asyncUpdateChatLog()
		return () => ChatRoom.Clear()
	}, [])
	
	if (ChatRoom.ID === "" || chatLog.length === 0)
		return <div style={{display: "table-cell"}}></div>
	
	scrollDown(100)
	
	return (
		<div style={{display: "table-cell"}}>
			
			<div id="ChatLog" style={{overflowY: "scroll", fontSize: ".45cm", height: "5cm"}}>
				{chatLog}
			</div>
			
			<input
				style={{width: "100%", boxSizing: "border-box", height: ".5cm", fontSize: ".4cm"}}
				id="SendMessageTextField"
				type="text"
				onKeyDown={event => {
					if (event.key !== "Enter" || User.ID === "" || ChatRoom.ID === "")
						return
					const msgBox = document.getElementById("SendMessageTextField") as HTMLInputElement
					if (msgBox.value !== "")
						HTTP.asyncPost(`chat/msg/${ChatRoom.ID}`,
							{ OwnerID: User.ID, Message: msgBox.value }, null,
							msg => {
								if (msg.responseText !== "")
									alert(`You are muted until: ${new Date(+msg.responseText).toString()}`)
							})
					msgBox.value = ""
			}}/>
		</div>
	)
}
