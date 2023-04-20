import HTTP from "../HTTP"

export default class NameStorage {
	static StorageMetaClass = class {
		constructor(private _urlFunc: (id: string) => string, private defExpirationTime: number = 10 * 60_000) {}
		
		private _nameMap = new Map<string, {data: string, expDate: number}>()
		
		Get(ID: string,
			forceUpdate: boolean = false,
			expirationTime: number | null = null)
			: string {
			
			if (!forceUpdate) {
				const user = this._nameMap.get(ID)
				if (!!user && user.expDate > Date.now())
					return user.data
			}
			
			const name = HTTP.Get(this._urlFunc(ID))
			this._nameMap.set(ID, {data: name, expDate: Date.now() + (expirationTime ?? this.defExpirationTime)})
			return name ?? ""
		}
		
		async asyncGet(ID: string,
			forceUpdate: boolean = false,
			expirationTime: number | null = null)
			: Promise<string> {
			
			if (!forceUpdate) {
				const user = this._nameMap.get(ID)
				if (!!user && user.expDate > Date.now())
					return user.data
			}
			
			const res = await HTTP.asyncGet(this._urlFunc(ID))
			if (res.status === 429)
				throw res
			const name = res.responseText
			this._nameMap.set(ID, {data: name, expDate: Date.now() + (expirationTime ?? this.defExpirationTime)})
			return name ?? ""
		}
		
		Clear(ID: string)
			{ this._nameMap.delete(ID) }
		
		_ManualSet(ID: string, name: string, expirationTime: number | null = null)
			{ this._nameMap.set(ID, {data: name, expDate: Date.now() + (expirationTime ?? this.defExpirationTime)}) }
	}
	
	static readonly User = new this.StorageMetaClass(ID => `user-profile/username/${ID}`)
	static readonly UserPFP = new this.StorageMetaClass(ID => `pfp/user/${ID}`)
	static readonly Room = new this.StorageMetaClass(ID => `chat/room/${ID}/Name`)
}
