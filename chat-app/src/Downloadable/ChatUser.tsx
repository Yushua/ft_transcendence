import HTTP from "../HTTP";
import { asyncUpdateFriendsList } from "../Windows/Chat/RoomSelect/FriendsList";
import { asyncUpdateRoomList } from "../Windows/Chat/RoomSelect/RoomList";

export default class ChatUser {
	private static _chatUser: any | null = null;
	
	static Clear() {
		this._chatUser = null
		this._clearEvent()
	}
	
	static async asyncDownload(userID: string) {
		const user = await JSON.parse(HTTP.Get(`chat/user/${userID}`))
		if (!!user) {
			this._chatUser = user
			this._updateEvent()
		}
	}
	
	static get ID():               string   { return this._chatUser?.ID ?? "" }
	static get ChatRoomsIn():      string[] { return this._chatUser?.ChatRoomsIn ?? [] }
	static get DirectChatsIn():    string[] { return this._chatUser?.DirectChatsIn ?? [] }
	static get FriedsWithDirect(): string[] { return this._chatUser?.FriedsWithDirect ?? [] }
	static get BlockedUserIDs():   string[] { return this._chatUser?.BlockedUserIDs ?? [] }
	
	private static _onClearFuncs: (() => void)[] = [
		
	]
	private static _onUpdateFuncs: ((roomID: string) => void)[] = [
		asyncUpdateFriendsList,
		asyncUpdateRoomList,
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
