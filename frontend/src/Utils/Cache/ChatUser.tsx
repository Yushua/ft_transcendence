import { ChatUserEvent } from "../../Chat/Events/ChatUserEventHandle";
import HTTP from "../HTTP";
import { SetMainWindow } from "../../Chat/Windows/MainChatWindow";
import ManualEventManager from "../../Events/ManualEventManager";

export default class ChatUser {
	private static _chatUser: any | null = null;
	
	static UpdateEvent = new ManualEventManager()
	static ClearEvent = new ManualEventManager([ () => SetMainWindow("") ])
	
	static Clear() {
		this._chatUser = null
		this.ClearEvent.Run()
	}
	
	static async asyncUpdate(userID: string) {
		if (userID === "")
			return
		const user = await JSON.parse(HTTP.Get(`chat/user/${userID}`))
		if (!!user) {
			this._chatUser = user
			ChatUserEvent.SubscribeServerSentEvent(`chat/event/user-${userID}`)
			this.UpdateEvent.Run()
		}
	}
	
	static get ID():               string   { return this._chatUser?.ID ?? "" }
	static get ChatRoomsIn():      string[] { return this._chatUser?.ChatRoomsIn ?? [] }
	static get DirectChatsIn():    string[] { return this._chatUser?.DirectChatsIn ?? [] }
	static get FriedsWithDirect(): string[] { return this._chatUser?.FriedsWithDirect ?? [] }
	static get BlockedUserIDs():   string[] { return this._chatUser?.BlockedUserIDs ?? [] }
}
