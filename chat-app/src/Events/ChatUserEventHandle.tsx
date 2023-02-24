import ChatUser from "../Cache/ChatUser";
import SSEManager from "./SSEManager";

export const ChatUserEvent: SSEManager = new SSEManager(msg => {
	console.log(msg)
	switch (msg) {
		case "room": ChatUser.asyncUpdate(ChatUser.ID); break
		default: break
	}
})
