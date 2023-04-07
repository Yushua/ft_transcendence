import ChatRoom from "../../Utils/Cache/ChatRoom";
import ChatUser from "../../Utils/Cache/ChatUser";
import SSEManager from "../../Events/SSEManager";
import OurHistory from "../../Utils/History";

export const ChatUserEvent: SSEManager = new SSEManager(msg => {
	if (msg.startsWith("kick")) {
		ChatUser.asyncUpdate(ChatUser.ID)
		if (msg.substring(4) === ChatRoom.ID) {
			ChatRoom.Clear();
			OurHistory.Add();
		}
		msg = "room"
	}
	switch (msg) {
		// @ts-ignore
		// case "kick": ChatRoom.Clear(); OurHistory.Add();
		case "room": ChatUser.asyncUpdate(ChatUser.ID); break
		default: break
	}
})
