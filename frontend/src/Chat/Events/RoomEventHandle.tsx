import ChatRoom from "../../Utils/Cache/ChatRoom";
import { asyncUpdateChatLog } from "../Windows/Chat/ActualChat/ChatWindow";
import SSEManager from "./SSEManager";

export const RoomEvent: SSEManager = new SSEManager(msg => {
	switch (msg) {
		case "room":
		case "mem": ChatRoom.asyncUpdate(ChatRoom.ID); break
		default:
			ChatRoom.UpdateMessageCount()
			asyncUpdateChatLog();
			break
	}
})
