import React, { useEffect, useMemo, useState } from "react";
import HTTP from "../../../../Utils/HTTP";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import User from "../../../../Utils/Cache/User";
import { Avatar, Button, CardHeader } from "@mui/material";
import { ChatLineHeight, ChatWindowHeight } from "../../MainChatWindow";
import ChatUser from "../../../../Utils/Cache/ChatUser";
import { socket } from "../../../../Games/contexts/WebsocketContext";
import OurHistory from "../../../../Utils/History";

var roomCache: Map<string, JSX.Element[]> = new Map<string, JSX.Element[]>()
var _chatLog: JSX.Element[] = []
var _fillDepth = 24
var _oldRoomID = ""

export function ClearChatMessageCache() {
	roomCache.clear()
	_oldRoomID = ""
	asyncUpdateChatLog()
}

function scrollDown(time: number) {
	setTimeout(() => {
			var log = document.getElementById("ChatLog") as HTMLElement
			if (!!log)
				log.scrollTop = log.scrollHeight
		}, time
	)
}

export async function asyncUpdateChatLog() {
	if (!_setChatLog)
		return
	if (_oldRoomID !== ChatRoom.ID) {
		if (_oldRoomID !== "" && _chatLog.length !== 0)
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
					<>
						{ChatUser.BlockedUserIDs.includes(msgs[i].OwnerID) ? <></> :
							(msgs[i].OwnerID === "game" ? 
								<div key={count + _msgCount} style={{textAlign: "left"}}>
									<Button
										variant={"contained"}
										style={{height: `${ChatLineHeight}px`, textAlign: "left"}}
										onClick={_ => {
											socket.emit('joinCustomGame', {gameID: msgs[i].Message, userID: User.ID, userName: User.Name})
										}}
									>Join game: {msgs[i].Message}</Button>
								</div> : <>
								<div key={count + _msgCount} style={{textAlign: "left"}}>
									<img
										src={`${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(msgs[i].OwnerID)}`}
										style={{width: `${ChatLineHeight * .8}px`, height: `${ChatLineHeight * .8}px`, borderRadius: "50%"}}
									/>
									<b>{`${NameStorage.User.Get(msgs[i].OwnerID)}`}</b>
									{`: ${msgs[i].Message}`}
								</div>
							</>)
						}
					</>
				)
			}
		}
		
		_chatLog = _chatLog.concat(newChatLog)
	}
	
	_msgCount = newMsgCount
	
	var chatLog = _chatLog.map(x=>x)
	for (var fill = 1; fill < _fillDepth; fill++)
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
	}, [])
	scrollDown(100)
	
	if (ChatRoom.ID === "" || chatLog.length === 0)
		return <div style={{display: "table-cell"}}></div>
	
	return (
		<div style={{display: "table-cell", color: "black", height: `${ChatWindowHeight}px`}}>
			
			<div id="ChatLog" style={{overflowY: "scroll", fontSize: `${ChatLineHeight * .9}px`, height: "94%"}}>
				{chatLog}
			</div>
			
			<input
				style={{width: "100%", boxSizing: "border-box", height: "5%", fontSize: `${ChatLineHeight * .8}px`}}
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
