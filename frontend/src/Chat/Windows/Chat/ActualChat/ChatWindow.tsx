import React, { useEffect, useState } from "react";
import HTTP from "../../../../Utils/HTTP";
import ChatRoom from "../../../../Utils/Cache/ChatRoom";
import NameStorage from "../../../../Utils/Cache/NameStorage";
import User from "../../../../Utils/Cache/User";
import { Button } from "@mui/material";
import { ChatLineHeight, ChatWindowHeight } from "../../MainChatWindow";
import ChatUser from "../../../../Utils/Cache/ChatUser";
import { socket } from "../../../../Games/contexts/WebsocketContext";
import ImgAsyncUrl from "../../../../Utils/ImgAsyncUrl";
import { Width } from "../../../../MainWindow/MainWindow";

var roomCache: Map<string, {lastCount: number, jsx: JSX.Element[]}> = new Map<string, {lastCount: number, jsx: JSX.Element[]}>()
var _chatLog: JSX.Element[] = []
var _msgCount: number = 0
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
			roomCache.set(_oldRoomID, {lastCount: _msgCount, jsx:_chatLog})
		_oldRoomID = ChatRoom.ID
		const data = roomCache.get(_oldRoomID) ?? {lastCount: 0, jsx: []}
		_chatLog = data.jsx
		_msgCount = data.lastCount
		if (ChatRoom.ID === "") {
			_setChatLog([<div><span>&#8203;</span></div>])
			return
		}
	}
	
	var _reactKeyThing = _chatLog.length
	
	const newMsgCount = ChatRoom.MessageCount
	
	if (newMsgCount > _msgCount) {
		var newChatLog = []
		var count = 0
		var target = newMsgCount - _msgCount
		if (target > 30)
			target = 30
		
		for (let page = 1; count < target; page++) {
			var msgs: any
			try {
				const res = HTTP.Get(`chat/msg/${ChatRoom.ID}/-${page}`)
				msgs = await JSON.parse(res)
			} catch (error) {
				console.log(error.status)
				if (error.status !== 429)
					return
				_setChatLog([<div key="key">Loading...</div>])
				scrollDown(0)
				setTimeout(() => {
					asyncUpdateChatLog()
				}, 1250);
				return
			}
			
			if (msgs.length == 0)
				break
			
			for (let i = msgs.length - 1; count < target && i >= 0; i--) {
				const url = new Promise((res, err) => {
					const id = msgs[i].OwnerID
					setTimeout(async () => {
						const url = await NameStorage.UserPFP.asyncGet(id)
						res(`${HTTP.HostRedirect()}pfp/${url}`)
					}, _reactKeyThing);
				})
				
				count++
				if (!ChatUser.BlockedUserIDs.includes(msgs[i].OwnerID))
					newChatLog.unshift(
						(msgs[i].OwnerID === "game" ?
							<div key={_reactKeyThing++} style={{textAlign: "left"}}>
								<Button
									variant={"contained"}
									style={{height: `${ChatLineHeight}px`, textAlign: "left"}}
									onClick={_ => {
										socket.emit('joinCustomGame', {gameID: msgs[i].Message, userID: User.ID, userName: User.Name})
									}}
								>Join game: {msgs[i].Message}</Button>
							</div> :
							<div key={_reactKeyThing++} style={{width: `${Width * .9 * .6 * .95}px`, textAlign: "left", overflowWrap: "break-word"}}>
								<ImgAsyncUrl
									id={`${_reactKeyThing} - ${msgs[i].OwnerID}`}
									asyncUrl={() => url}
									style={{width: `${ChatLineHeight * .8}px`, height: `${ChatLineHeight * .8}px`, borderRadius: "50%"}}
								/>
								<b>{`${NameStorage.User.Get(msgs[i].OwnerID)}`}</b>
								{`: ${msgs[i].Message}`}
							</div>
						)
				)
			}
		}
		
		_chatLog = _chatLog.concat(newChatLog)
	}
	
	_msgCount = newMsgCount
	
	var chatLog = _chatLog.map(x=>x)
	for (var fill = 1; fill < _fillDepth; fill++)
		chatLog.unshift(<div key={_reactKeyThing++}><span>&#8203;</span></div>)
	
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
				autoComplete="off"
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
