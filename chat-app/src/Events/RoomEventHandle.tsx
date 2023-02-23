import ChatRoom from "../Downloadable/ChatRoom";
import { asyncUpdateChatLog } from "../Windows/Chat/ActualChat/ChatWindow";
import SSEManager from "./EventListener";

export const RoomEvent: SSEManager = new SSEManager(msg => {
	switch (msg) {
		case "msg": asyncUpdateChatLog(); break
		case "mem": ChatRoom.asyncDownload(ChatRoom.ID); break
		default: break
	}
})
