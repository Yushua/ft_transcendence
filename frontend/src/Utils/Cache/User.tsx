import ManualEventManager from "../../Events/ManualEventManager";
import HTTP from "../HTTP";
import ChatUser from "./ChatUser";
import NameStorage from "./NameStorage";

export default class User {
	static _user: any | null = null;
	
	static UpdateEvent = new ManualEventManager([ () => {ChatUser.asyncUpdate(this.ID)} ])
	static ClearEvent = new ManualEventManager([ () => ChatUser.Clear() ])
	
	static Clear() {
		this._user = null
		this.ClearEvent.Run()
	}
	
	static async asyncUpdate(userID: string) {
		if (userID === "")
			return
		const user = await JSON.parse(HTTP.Get(`user-profile/user/${userID}`))
		if (!!user) {
			console.log(user.id)
			console.log(user.friendList)
			this._user = user
			NameStorage.User._ManualSet(user.id, user.username)
			this.UpdateEvent.Run()
		}
	}
	
	static get ID():       string   { return this._user?.id ?? "" }
	static get Name():     string   { return this._user?.username ?? "" }
	static get Password(): string   { return this._user?.password ?? "" }
	static get Email():    string   { return this._user?.eMail ?? "" }
	static get IconURL():  string   { return this._user?.profilePicture ?? "" }
	static get Friends():  string[] { return this._user?.friendList ?? [] }
	static get ProfilePicture():  string { return this._user?.profilePicture ?? "" }
}
