import React, { useState } from "react";
import HTTP from "../HTTP";
import ChatRoom from "../Downloadable/ChatRoom";
import NameStorage from "../NameStorage";
import User from "../Downloadable/User";

var _logDepth = 10

export async function asyncUpdateChatLog() {
	if (ChatRoom.ID === "" || !_setChatLog)
		return
	var chat: string[] = []
	var count = 0

	for (let page = 1; count < _logDepth; page++) {
		const msgs = await JSON.parse(HTTP.Get(`chat/msg/${ChatRoom.ID}/-${page}`))
		
		if (msgs.length == 0)
			break
		
		for (let i = msgs.length - 1; count < _logDepth && i >= 0; i--) {
			count++
			chat.unshift(`${await NameStorage.asyncGetUser(msgs[i].OwnerID)}: ${msgs[i].Message}`)
		}
	}
	
	for (; count < 10; count++)
		chat.unshift('')
	
	_setChatLog(chat)
}

var _setChatLog: React.Dispatch<React.SetStateAction<string[]>> | null = null

export default function ChatWindow(props: any) {
	var onSelectCallBack: (userID: string) => void = props.onSelectCallBack
	
	const [chatLog, setChatLog] = useState<string[]>([])
	_setChatLog = setChatLog
	
	if (ChatRoom.ID === "")
		return <div style={{border: "solid", overflow: "hidden", display: "table-cell"}}></div>
	
	if (chatLog.length === 0)
		asyncUpdateChatLog()

	return (
		<div style={{border: "solid", overflow: "hidden", display: "table-cell"}}>
			{chatLog.map(msg => <div style={{textAlign: "left"}}>{msg}<br/></div>)}
			<input style={{overflow: "hidden", width: "100%"}} id="SendMessageTextField" type="text" onKeyDown={event => {
				if (event.key !== "Enter" || User.ID === "" || ChatRoom.ID === "")
					return
				const msgBox = document.getElementById("SendMessageTextField") as HTMLInputElement
				if (msgBox.value !== "")
					HTTP.asyncPost(`chat/msg/${ChatRoom.ID}`, { OwnerID: User.ID, Message: msgBox.value })
				msgBox.value = ""
			}}/>
		</div>
	)
}
