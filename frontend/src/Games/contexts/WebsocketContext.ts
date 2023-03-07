import { createContext } from "react"
import { io, Socket } from 'socket.io-client'
import HTTP from '../../Utils/HTTP'

export const socket = io(HTTP.HostRedirect())
export const WebsocketContext = createContext<Socket>(socket)
export const WebsocketProvider = WebsocketContext.Provider
