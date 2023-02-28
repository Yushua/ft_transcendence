import HTTP from "../Utils/HTTP";
import NameStorage from "./NameStorage";

export default class User {
	private static _user: any | null = null;
	
	static Clear() {
		this._user = null
		this._clearEvent()
	}
	
	static async asyncUpdate(userID: string) {
		if (userID === "")
			return
		const user = await JSON.parse(HTTP.Get(`user-profile/user/${userID}`))
		if (!!user) {
			await NameStorage.asyncGetUser(user.id)
			for (const memberID of user.friendList)
				await NameStorage.asyncGetUser(memberID)
			this._user = user
			this._updateEvent()
		}
	}
	
	static get ID():       string   { return this._user?.id ?? "" }
	static get Name():     string   { return this._user?.username ?? "" }
	static get Password(): string   { return this._user?.password ?? "" }
	static get Email():    string   { return this._user?.eMail ?? "" }
	static get IconURL():  string   { return this._user?.profilePicture ?? "" }
	static get Friends():  string[] { return this._user?.friendList ?? [] }
	
	private static _onClearFuncs: (() => void)[] = [
		
	]
	private static _onUpdateFuncs: ((roomID: string) => void)[] = [
		
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
