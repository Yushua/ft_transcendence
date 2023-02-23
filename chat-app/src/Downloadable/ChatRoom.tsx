import HTTP from "../HTTP";
import { RoomEvent } from "../Events/RoomEventHandle";
import ChatUser from "./ChatUser";
import NameStorage from "./NameStorage";
import { asyncUpdateMemberList } from "../Windows/Chat/Members/MembersList";
import { asyncUpdateChatLog } from "../Windows/Chat/ActualChat/ChatWindow";
import { asyncUpdateRoomList } from "../Windows/Chat/RoomSelect/RoomList";
import { asyncUpdateFriendsList } from "../Windows/Chat/RoomSelect/FriendsList";
import { asyncUpdateMembersWindow } from "../Windows/Chat/Members/MembersWindow";

export default class ChatRoom {
	private static _chatRoom: any | null = null;
	
	static Clear() {
		this._chatRoom = null
		this._clearEvent()
	}
	
	static async asyncDownload(roomID: string) {
		const room = await JSON.parse(HTTP.Get(`chat/room/${roomID}`)) ?? null
		if (!!room) {
			for (const memberID of room.MemberIDs)
				await NameStorage.asyncGetUser(memberID)
			for (const memberID of room.BanIDs)
				await NameStorage.asyncGetUser(memberID)
			this._chatRoom = room
			RoomEvent.SubscribeToUserEvent(`chat/event/room-${roomID}`)
			this._updateEvent()
		}
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
	static get Password():          string   { return this._chatRoom?.Password ?? "" }
	static get RoomType():          string   { return this._chatRoom?.RoomType ?? "" }
	static get MemberIDs():         string[] { return this._chatRoom?.MemberIDs ?? [] }
	static get AdminIDs():          string[] { return this._chatRoom?.AdminIDs ?? [] }
	static get BanIDs():            string[] { return this._chatRoom?.BanIDs ?? [] }
	static get MuteIDs():           string[] { return this._chatRoom?.MuteIDs ?? [] }
	static get MuteDates():         string[] { return this._chatRoom?.MuteDates ?? [] }
	static get MessageGroupDepth(): number   { return this._chatRoom?.MessageGroupDepth ?? 0 }
	static get Direct():            boolean  { return this._chatRoom?.Direct ?? true }
	
	private static _onClearFuncs: (() => void)[] = [
		asyncUpdateChatLog,
		asyncUpdateMemberList,
	]
	private static _onUpdateFuncs: ((roomID: string) => void)[] = [
		asyncUpdateFriendsList,
		asyncUpdateRoomList,
		asyncUpdateMemberList,
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
