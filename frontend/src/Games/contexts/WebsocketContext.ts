import { createContext } from "react"
import { io, Socket } from 'socket.io-client'
import HTTP from '../../Utils/HTTP'
import { getCookie } from "typescript-cookie"

export function ConenctSocket() {
	socket= io(HTTP.HostRedirect(), {
		extraHeaders: {
			Authorization: `Bearer ${getCookie("accessToken")}`
		}
	})
	WebsocketContext = createContext<Socket>(socket)
	WebsocketProvider = WebsocketContext.Provider
}

export var socket: Socket// = io(HTTP.HostRedirect())
export var WebsocketContext = createContext<Socket>(socket)
export var WebsocketProvider = WebsocketContext.Provider
