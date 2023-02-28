import { ChatUserEvent } from "../../Chat/Events/ChatUserEventHandle";
import HTTP from "../HTTP";
import { asyncUpdateMembersWindow } from "../../Chat/Windows/Chat/Members/MembersWindow";
import { asyncUpdateFriendsList } from "../../Chat/Windows/Chat/RoomSelect/FriendsList";
import { asyncUpdateRoomList } from "../../Chat/Windows/Chat/RoomSelect/RoomList";
import { SetMainWindow } from "../../Chat/Windows/MainChatWindow";

export default class ChatUser {
	private static _chatUser: any | null = null;
	
	static Clear() {
		this._chatUser = null
		this._clearEvent()
	}
	
	static async asyncUpdate(userID: string) {
		if (userID === "")
			return
		const user = await JSON.parse(HTTP.Get(`chat/user/${userID}`))
		if (!!user) {
			this._chatUser = user
			ChatUserEvent.SubscribeToUserEvent(`chat/event/user-${userID}`)
			this._updateEvent()
		}
	}
	
	static get ID():               string   { return this._chatUser?.ID ?? "" }
	static get ChatRoomsIn():      string[] { return this._chatUser?.ChatRoomsIn ?? [] }
	static get DirectChatsIn():    string[] { return this._chatUser?.DirectChatsIn ?? [] }
	static get FriedsWithDirect(): string[] { return this._chatUser?.FriedsWithDirect ?? [] }
	static get BlockedUserIDs():   string[] { return this._chatUser?.BlockedUserIDs ?? [] }
	
	private static _onClearFuncs: (() => void)[] = [
		asyncUpdateFriendsList,
		asyncUpdateRoomList,
		asyncUpdateMembersWindow,
		() => SetMainWindow(""),
	]
	private static _onUpdateFuncs: ((userID: string) => void)[] = [
		asyncUpdateFriendsList,
		asyncUpdateRoomList,
		asyncUpdateMembersWindow,
	]
	
	private static _clearEvent() {
		for (const func of this._onClearFuncs)
			func()
	}
	
	private static _updateEvent() {
		for (const func of this._onUpdateFuncs)
			func(this.ID)
	}
}
