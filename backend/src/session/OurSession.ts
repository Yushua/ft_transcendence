import { stat } from "fs"
import { Socket } from "socket.io"
import { UserProfile } from "src/user-profile/user.entity"

export default class OurSession {
	
	private static _userMap = new Map<string, {sockets: [Socket], state: number}>()
	private static _socketMap = new Map<Socket, string>()
	
	static GetUserState(userID: string) {
		const state = this._userMap.get(userID)?.state
		if (state === undefined)
			return "offline"
		return state > 0 ? "inGame" : "online"
	}
	
	static SocketConnecting(user: UserProfile, socket: Socket) {
		var userEntry = this._userMap.get(user.id)
		if (!userEntry) {
			userEntry = {sockets: [socket], state: 0}
			this._userMap.set(user.id, userEntry)
		}
		else
			userEntry.sockets.push(socket)
		
		this._socketMap.set(socket, user.id)
		
		console.log(`User '${user.id}' connected: ${socket.id}`)
	}
	
	static SocketDisconnecting(socket: Socket, userID: string | null = null) {
		userID ??= this._socketMap.get(socket)
		this._socketMap.delete(socket)
		
		const userEntry = this._userMap.get(userID)
		if (userEntry.sockets.length == 1)
			this._userMap.delete(userID)
			userEntry.sockets.splice(userEntry.sockets.indexOf(socket), 1)
		
		console.log(`User '${userID}' disconnectd: ${socket.id}`)
	}
	
	static GameJoining(socket: Socket, userID: string | null = null) {
		userID ??= this._socketMap.get(socket)
		const userEnty = this._userMap.get(userID)
		userEnty.state += 1
		
		console.log(`User '${userID}' joined a Game: ${socket.id}`)
	}
	
	static GameLeaving(socket: Socket, userID: string | null = null) {
		userID ??= this._socketMap.get(socket)
		const userEnty = this._userMap.get(userID)
		userEnty.state -= 1
		
		console.log(`User '${userID}' left a Game: ${socket.id}`)
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
