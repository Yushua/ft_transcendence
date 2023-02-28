import ChatRoom from "../Cache/ChatRoom";
import ChatUser from "../Cache/ChatUser";
import SSEManager from "./SSEManager";

export const ChatUserEvent: SSEManager = new SSEManager(msg => {
	console.log(msg)
	switch (msg) {
		// @ts-ignore
		case "kick": ChatRoom.Clear();
		case "room": ChatUser.asyncUpdate(ChatUser.ID); break
		default: break
	}
})
