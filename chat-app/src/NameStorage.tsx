import { HTTP } from "./HTTP"

export class NameStorage {
	private static _users = new Map<string, string>
	static async GetUser(userID: string): Promise<string> {
		var name = this._users.get(userID)
		if (!!name)
			return name
		
		name = (await JSON.parse(HTTP.Get(`user-profile/user/${userID}`) ?? ""))?.username ?? undefined
		if (!name)
			return ""
		this._users.set(userID, name)
		return name
	}
	
	private static _rooms = new Map<string, string>
	static GetRoom(roomID: string): string {
		var name = this._rooms.get(roomID)
		if (!!name)
			return name
		name = HTTP.Get(`chat/room/${roomID}/name`) ?? undefined
		if (!name)
			return ""
		this._rooms.set(roomID, name)
		return name
	}
}
