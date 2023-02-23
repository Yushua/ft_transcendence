import HTTP from "../HTTP"
import ChatRoom from "./ChatRoom"

export default class NameStorage {
	private static _users = new Map<string, string>
	static async asyncGetUser(userID: string): Promise<string> {
		var name = this._users.get(userID)
		if (!!name)
			return name
		
		name = (await JSON.parse(HTTP.Get(`user-profile/user/${userID}`) ?? ""))?.username ?? undefined
		if (!name)
			return ""
		this._users.set(userID, name)
		return name
	}
	
	static GetUser(userID: string): string {
		return this._users.get(userID) ?? ""
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
}
