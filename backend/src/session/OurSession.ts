import { UserProfile } from "src/user-profile/user.entity"

export default class OurSession {
	
	private static _userMap = new Map<string, {socketIDs: [string], state: number}>()
	private static _socketIDMap = new Map<string, string>()
	
	static GetUserState(userID: string) {
		const state = this._userMap.get(userID)?.state
		if (state === undefined)
			return "offline"
		return state > 0 ? "inGame" : "online"
	}
	
	static SocketConnecting(user: UserProfile, socketID: string) {
		var userEntry = this._userMap.get(user.id)
		if (!userEntry) {
			userEntry = {socketIDs: [socketID], state: 0}
			this._userMap.set(user.id, userEntry)
		}
		else
			userEntry.socketIDs.push(socketID)
		
		this._socketIDMap.set(socketID, user.id)
		console.log(`User '${user.id}' connected: ${socketID}`)
	}
	
	static SocketDisconnecting(socketID: string, userID: string | null = null) {
		userID ??= this._socketIDMap.get(socketID)
		this._socketIDMap.delete(socketID)
		
		const userEntry = this._userMap.get(userID)
		if (userEntry.socketIDs.length == 1)
			this._userMap.delete(userID)
			userEntry.socketIDs.splice(userEntry.socketIDs.indexOf(socketID), 1)
		
		console.log(`User '${userID}' disconnected: ${socketID}`)
	}
	
	static GameJoining(socketID: string, userID: string | null = null) {
		userID ??= this._socketIDMap.get(socketID)
		const userEnty = this._userMap.get(userID)
		userEnty.state += 1
		
		console.log(`User '${userID}' joined a Game: ${socketID}`)
	}
	
	static GameLeaving(socketID: string, userID: string | null = null) {
		userID ??= this._socketIDMap.get(socketID)
		const userEnty = this._userMap.get(userID)
		userEnty.state -= 1
		
		console.log(`User '${userID}' left a Game: ${socketID}`)
	}
}

// class ManualEventManager {
// 	constructor (events: (() => void)[] = []) {
// 		this._events = events
// 	}
	
// 	private _events: (() => void)[] = []
	
// 	Run() {
// 		for (const func of this._events)
// 			func()
// 	}
	
// 	Subscribe(func: () => void) {
// 		if (!this._events.includes(func))
// 			this._events.push(func)
// 	}
// }
