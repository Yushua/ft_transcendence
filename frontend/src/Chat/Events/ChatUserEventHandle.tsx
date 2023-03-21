import ChatRoom from "../../Utils/Cache/ChatRoom";
import ChatUser from "../../Utils/Cache/ChatUser";
import SSEManager from "../../Events/SSEManager";
import OurHistory from "../../Utils/History";

export const ChatUserEvent: SSEManager = new SSEManager(msg => {
	switch (msg) {
		// @ts-ignore
		case "kick": ChatRoom.Clear(); OurHistory.Add();
		case "room": ChatUser.asyncUpdate(ChatUser.ID); break
		default: break
	}
})
