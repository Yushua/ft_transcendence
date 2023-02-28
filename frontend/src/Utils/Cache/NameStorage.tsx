import HTTP from "../HTTP"
import ChatRoom from "./ChatRoom"

export default class NameStorage {
	private static _users = new Map<string, string>
	static GetUser(userID: string): string {
		var name = this._users.get(userID) ?? ""
		if (!!name)
			return name
		name = HTTP.Get(`user-profile/username/${userID}`) ?? undefined
		if (!name)
			return ""
		this._users.set(userID, name)
		return name
	}
	static ClearUser(userID: string) {
		this._users.delete(userID)
	}
	
	private static _rooms = new Map<string, string>
	static GetRoom(roomID: string): string {
		var name = this._rooms.get(roomID)
		if (!!name)
			return name
		name = HTTP.Get(`chat/room/${roomID}/Name`) ?? undefined
		if (!name)
			return ""
		this._rooms.set(roomID, name)
		return name
	}
	static ClearRoom(roomID: string) {
		this._rooms.delete(roomID)
	}
}
