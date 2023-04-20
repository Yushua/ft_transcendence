import HTTP from "../HTTP";
import { RoomEvent } from "../../Chat/Events/RoomEventHandle";
import ChatUser from "./ChatUser";
import NameStorage from "./NameStorage";
import ManualEventManager from "../../Events/ManualEventManager";
import OurHistory from "../History";
import { SetMainChatWindow } from "../../Chat/Windows/MainChatWindow";
import { UpdateRoomSelectWindowButtons } from "../../Chat/Windows/Chat/RoomSelect/RoomSelectWindow";

export default class ChatRoom {
	static _chatRoom: any | null = null
	
	static ClearEvent = new ManualEventManager()
	static UpdateEvent = new ManualEventManager()
	static ChangeEvent = new ManualEventManager()
	
	static Clear() {
		this._chatRoom = null
		this.ClearEvent.Run()
	}
	
	static async asyncUpdate(roomID: string, addToHistory: boolean = false) {
		OurHistory.ClearEvent.Subscribe(() => ChatRoom.Clear())
		if (roomID === "")
			return
		const res = HTTP.Get(`chat/room/${roomID}`)
		const room = await JSON.parse(res) ?? null
		if (!!room) {
			const oldID = this._chatRoom?.id;
			this._chatRoom = room
			RoomEvent.SubscribeServerSentEvent(`chat/event/room-${roomID}`)
			NameStorage.Room._ManualSet(room.ID, room.Name)
			this.UpdateEvent.Run()
			if (this.ID !== oldID)
				this.ChangeEvent.Run()
			if (addToHistory) {
				OurHistory.Add("ChatRoomChange", {roomID: this.ID}, async args => {
					await this.asyncUpdate(args.get("roomID"))
					SetMainChatWindow("chat")
					UpdateRoomSelectWindowButtons()
				})
			}
		}
		else
			this.Clear()
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
}
