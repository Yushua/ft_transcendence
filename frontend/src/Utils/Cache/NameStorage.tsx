import HTTP from "../HTTP"

export default class NameStorage {
	static StorageMetaClass = class {
		constructor(private _urlFunc: (id: string) => string) {}
		
		private _nameMap = new Map<string, [string, number]>
		
		Get(ID: string,
			forceUpdate: boolean = false,
			expirationTime: number = 4200 * 60)
			: string {
				
			if (!forceUpdate) {
				const user = this._nameMap.get(ID)
				if (!!user && user[1] < Date.now())
					return user[0]
			}
			
			const name = HTTP.Get(this._urlFunc(ID))
			this._nameMap.set(ID, [name, Date.now() + expirationTime])
			return name ?? ""
		}
		
		Clear(ID: string)
			{ this._nameMap.delete(ID) }
		
		Set(ID: string, name: string, expirationTime: number = 4200 * 60)
			{ this._nameMap.set(ID, [name, Date.now() + expirationTime]) }
	}
	
	static readonly User = new this.StorageMetaClass(ID => `user-profile/username/${ID}`)
	static readonly Room = new this.StorageMetaClass(ID => `chat/room/${ID}/Name`)
	
	//#region Legacy Functions
	static readonly GetRoom = (ID: string, forceUpdate: boolean = false, expirationTime: number = 4200 * 60)
		: string => this.Room.Get(ID, forceUpdate, expirationTime)
	static readonly SetRoom = (ID: string, name: string, expirationTime: number = 4200 * 60)
		: void => this.Room.Set(ID, name, expirationTime)
	static readonly ClearRoom = (ID: string)
		: void => this.Room.Clear(ID)
	
	static readonly GetUser = (ID: string, forceUpdate: boolean = false, expirationTime: number = 4200 * 60)
		: string => this.User.Get(ID, forceUpdate, expirationTime)
	static readonly SetUser = (ID: string, name: string, expirationTime: number = 4200 * 60)
		: void => this.User.Set(ID, name, expirationTime)
	static readonly ClearUser = (ID: string)
		: void => this.User.Clear(ID)
	//#endregion
}
