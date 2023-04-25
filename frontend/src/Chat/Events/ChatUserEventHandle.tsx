import ChatRoom from "../../Utils/Cache/ChatRoom";
import ChatUser from "../../Utils/Cache/ChatUser";
import SSEManager from "../../Events/SSEManager";
import OurHistory from "../../Utils/History";

export const ChatUserEvent: SSEManager = new SSEManager(msg => {
	ChatUser.asyncUpdate(ChatUser.ID)
	if (msg.startsWith("kick")) {
		if (msg.substring(4) === ChatRoom.ID) {
			ChatRoom.Clear();
			OurHistory.Add();
		}
		msg = "room"
	}
})
