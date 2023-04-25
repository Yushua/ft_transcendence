import { createContext } from "react"
import { io, Socket } from 'socket.io-client'
import HTTP from '../../Utils/HTTP'
import { getCookie } from "typescript-cookie"
import { SpectateGame } from "../pong/Pong";
import { JoinedGame } from "../pong/Pong";

export function ConnectSocket() {
	try {
		socket.disconnect();
	} catch (error) { /* Ignore error */ }
	
	socket = io(HTTP.HostRedirect(), {
		extraHeaders: {
			Authorization: `Bearer ${getCookie("accessToken")}`
		}
	})

	socket.on('joined', (controls:string) => {
		JoinedGame(controls)
	})

	socket.on('spectating', () => {
		SpectateGame()
	})

	WebsocketContext = createContext<Socket>(socket)
	WebsocketProvider = WebsocketContext.Provider
}

export var socket: Socket// = io(HTTP.HostRedirect())
export var WebsocketContext = createContext<Socket>(socket)
export var WebsocketProvider = WebsocketContext.Provider
