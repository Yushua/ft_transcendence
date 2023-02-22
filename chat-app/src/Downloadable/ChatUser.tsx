import HTTP from "../HTTP";

export default class ChatUser {
	private static _chatUser: any | null = null;
	
	static Clear() { this._chatUser = null }
	
	static async asyncDownload(userID: string) {
		const user = await JSON.parse(HTTP.Get(`chat/user/${userID}`))
		if (!!user)
			this._chatUser = user
	}
	
	static get ID():               string   { return this._chatUser?.ID ?? "" }
	static get ChatRoomsIn():      string[] { return this._chatUser?.ChatRoomsIn ?? [] }
	static get DirectChatsIn():    string[] { return this._chatUser?.DirectChatsIn ?? [] }
	static get FriedsWithDirect(): string[] { return this._chatUser?.FriedsWithDirect ?? [] }
	static get BlockedUserIDs():   string[] { return this._chatUser?.BlockedUserIDs ?? [] }
}
