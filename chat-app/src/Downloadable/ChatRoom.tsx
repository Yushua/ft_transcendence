import HTTP from "../HTTP";
import ChatUser from "./ChatUser";

export default class ChatRoom {
	private static _chatRoom: any | null = null;
	
	static async asyncDownload(roomID: string) {
		this._chatRoom = await JSON.parse(HTTP.Get(`chat/room/${roomID}`)) ?? null
	}
	
	static IsRoomOfFriend(friendID: string): boolean {
		const index = ChatUser.FriedsWithDirect.indexOf(friendID)
		if (index >= 0)
			return this.ID === ChatUser.DirectChatsIn[index]
		return false
	}
	
	static get ID():                string   { return this._chatRoom?.ID ?? "" }
	static get OwnerID():           string   { return this._chatRoom?.OwnerID ?? [] }
	static get Password():          string   { return this._chatRoom?.Password ?? [] }
	static get RoomType():          string   { return this._chatRoom?.RoomType ?? [] }
	static get MemberIDs():         string[] { return this._chatRoom?.BlockedUserIDs ?? [] }
	static get AdminIDs():          string[] { return this._chatRoom?.MemberIDs ?? [] }
	static get BanIDs():            string[] { return this._chatRoom?.AdminIDs ?? [] }
	static get MuteIDs():           string[] { return this._chatRoom?.MuteIDs ?? [] }
	static get MuteDates():         string[] { return this._chatRoom?.BlockedUserIDs ?? [] }
	static get MessageGroupDepth(): number   { return this._chatRoom?.MessageGroupDepth ?? [] }
	static get Name():              string   { return this._chatRoom?.Name ?? [] }
	static get Direct():            boolean  { return this._chatRoom?.Direct ?? [] }
}
