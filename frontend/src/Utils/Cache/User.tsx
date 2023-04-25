import ManualEventManager from "../../Events/ManualEventManager";
import { ConnectSocket } from "../../Games/contexts/WebsocketContext";
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
	
	static async asyncUpdate() {
		const res = HTTP.Get(`user-profile/user`)
		const user = (await JSON.parse(res)).user
		this._ManualUpdate(user)
	}

	static async _ManualUpdate(user: any) {
		if (!!user) {
			this._user = user
			NameStorage.User._ManualSet(user.id, user.username)
			NameStorage.UserPFP._ManualSet(user.id, user.profilePicture)
			ConnectSocket()
			this.UpdateEvent.Run()
		}
	}
	
	static get ID():       string   		{ return this._user?.id ?? "" }
	static get Name():     string   		{ return this._user?.username ?? "" }
	static get intraname():string   		{ return this._user?.intraName ?? "" }
	static get Password(): string   		{ return this._user?.password ?? "" }
	static get IconURL():  	string   		{ return this._user?.profilePicture ?? "" }
	static get ProfilePicture():  string 	{ return this._user?.profilePicture ?? "" }
	static get TWTStatus():  boolean 		{ return this._user?.TWTStatus ?? false }
	static get Friends():  string[] 		{ return this._user?.friendList ?? [] }
	static get wins():  number 				{ return this._user?.wins ?? -1 }
	static get losses():  number 			{ return this._user?.losses ?? -1 }
}
