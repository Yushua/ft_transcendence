import HTTP from "../Utils/HTTP";
import { RoomEvent } from "../Events/RoomEventHandle";
import ChatUser from "./ChatUser";
import NameStorage from "./NameStorage";
import { asyncUpdateMemberList } from "../Windows/Chat/Members/MembersList";
import { asyncUpdateChatLog } from "../Windows/Chat/ActualChat/ChatWindow";
import { asyncUpdateRoomList } from "../Windows/Chat/RoomSelect/RoomList";
import { asyncUpdateFriendsList } from "../Windows/Chat/RoomSelect/FriendsList";
import { asyncUpdateMembersWindow } from "../Windows/Chat/Members/MembersWindow";

export default class ChatRoom {
	private static _chatRoom: any | null = null
	private static _chatRoomPass: string = ""
	
	static Clear() {
		this._chatRoomPass = ""
		this._chatRoom = null
		this._clearEvent()
	}
	
	static async asyncUpdate(roomID: string) {
		if (roomID === "")
			return
		const room = await JSON.parse(HTTP.Get(`chat/room/${roomID}`)) ?? null
		if (!!room) {
			for (const memberID of room.MemberIDs)
				await NameStorage.asyncGetUser(memberID)
			for (const memberID of room.BanIDs)
				await NameStorage.asyncGetUser(memberID)
			this._chatRoomPass = (!room.Direct && room.OwnerID === ChatUser.ID) ? HTTP.Get(`chat/pass/${roomID}`) : ""
			this._chatRoom = room
			RoomEvent.SubscribeToUserEvent(`chat/event/room-${roomID}`)
			this._updateEvent()
		}
	}
	
	static UpdateMessageCount() {
		if (this.ID === "")
			return
		this._chatRoom.MessageCount = +HTTP.Get(`chat/room/${this.ID}/MessageCount`)
	}
	
	static IsRoomOfFriend(friendID: string): boolean {
		const index = ChatUser.FriedsWithDirect.indexOf(friendID)
		if (index >= 0)
			return this.ID === ChatUser.DirectChatsIn[index]
		return false
	}
	
	static get ID():                string   { return this._chatRoom?.ID ?? "" }
	static get OwnerID():           string   { return this._chatRoom?.OwnerID ?? "" }
	static get Name():              string   { return this._chatRoom?.Name ?? "" }
	static get Private():           boolean  { return this._chatRoom?.RoomType ?? true }
	static get MemberIDs():         string[] { return this._chatRoom?.MemberIDs ?? [] }
	static get AdminIDs():          string[] { return this._chatRoom?.AdminIDs ?? [] }
	static get BanIDs():            string[] { return this._chatRoom?.BanIDs ?? [] }
	static get MuteIDs():           string[] { return this._chatRoom?.MuteIDs ?? [] }
	static get MuteDates():         string[] { return this._chatRoom?.MuteDates ?? [] }
	static get MessageGroupDepth(): number   { return this._chatRoom?.MessageGroupDepth ?? 0 }
	static get MessageCount():      number   { return this._chatRoom?.MessageCount ?? 0 }
	static get Direct():            boolean  { return this._chatRoom?.Direct ?? true }
	static get Password():          string   { return this._chatRoomPass }
	
	private static _onClearFuncs: (() => void)[] = [
		asyncUpdateChatLog,
		asyncUpdateMemberList,
	]
	private static _onUpdateFuncs: ((roomID: string) => void)[] = [
		asyncUpdateFriendsList,
		asyncUpdateRoomList,
		asyncUpdateMemberList,
		asyncUpdateMembersWindow,
		asyncUpdateChatLog,
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
