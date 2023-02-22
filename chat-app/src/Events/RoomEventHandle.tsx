import { asyncUpdateChatLog } from "../Divs/ChatWindow";
import SSEManager from "./EventListener";

export const RoomEvent: SSEManager = new SSEManager(msg => {
	switch (msg) {
		case "msg":
			asyncUpdateChatLog()
			break;
		default:
			break;
	}
})
