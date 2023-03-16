import ChatRoom from "../../Utils/Cache/ChatRoom";
import ChatUser from "../../Utils/Cache/ChatUser";
import SSEManager from "../../Events/SSEManager";

export const ChatUserEvent: SSEManager = new SSEManager(msg => {
	switch (msg) {
		// @ts-ignore
		case "kick": ChatRoom.Clear();
		case "room": ChatUser.asyncUpdate(ChatUser.ID); break
		default: break
	}
})
