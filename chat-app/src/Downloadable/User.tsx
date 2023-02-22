import HTTP from "../HTTP";

export default class User {
	private static _user: any | null = null;
	
	static async asyncDownload(userID: string) {
		const user = await JSON.parse(HTTP.Get(`user-profile/user/${userID}`))
		if (!!user)
			this._user = user
	}
	
	static get ID():       string   { return this._user?.id ?? "" }
	static get Name():     string   { return this._user?.username ?? [] }
	static get Password(): string   { return this._user?.password ?? [] }
	static get Email():    string   { return this._user?.eMail ?? [] }
	static get IconURL():  string   { return this._user?.profilePicture ?? [] }
	static get Friends():  string[] { return this._user?.friendList ?? [] }
}
