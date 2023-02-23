import React, { useState } from "react";
import HTTP from "../HTTP";
import ChatRoom from "../Downloadable/ChatRoom";
import NameStorage from "../NameStorage";
import User from "../Downloadable/User";

var _logDepth = 30

export async function asyncUpdateChatLog() {
	if (ChatRoom.ID === "" || !_setChatLog)
		return
	var chat: JSX.Element[] = []
	var count = 0

	for (let page = 1; count < _logDepth; page++) {
		const msgs = await JSON.parse(HTTP.Get(`chat/msg/${ChatRoom.ID}/-${page}`))
		
		if (msgs.length == 0)
			break
		
		for (let i = msgs.length - 1; count < _logDepth && i >= 0; i--) {
			count++
			chat.unshift(<div style={{textAlign: "left"}}>{`${await NameStorage.asyncGetUser(msgs[i].OwnerID)}: ${msgs[i].Message}`}</div>)
		}
	}
	
	for (; count < 10; count++)
		chat.unshift(<div><span>&#8203;</span></div>)
	
	_setChatLog(chat)
	var log = document.getElementById("ChatLog") as HTMLElement
	log.scrollTop = log.scrollHeight
}

var _setChatLog: React.Dispatch<React.SetStateAction<JSX.Element[]>> | null = null

export default function ChatWindow(props: any) {
	var onSelectCallBack: (userID: string) => void = props.onSelectCallBack
	
	const [chatLog, setChatLog] = useState<JSX.Element[]>([])
	_setChatLog = setChatLog
	
	if (ChatRoom.ID === "")
		return <div style={{display: "table-cell"}}></div>
	
	if (chatLog.length === 0)
		asyncUpdateChatLog()

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
							{ OwnerID: User.ID, Message: msgBox.value })
					msgBox.value = ""
			}}/>
		</div>
	)
}
