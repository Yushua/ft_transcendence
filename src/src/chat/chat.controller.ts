import { Controller, Get, Post, Patch, Delete, Body, Param, Sse } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat_objects/chat_message';
import { ChatRoom } from './chat_objects/chat_room';
import { ChatUser } from './chat_objects/chat_user';
import { ChatMessageDTO } from './dto/chat_message.dto';
import { ChatRoomDTO } from './dto/chat_room.dto';
import { ChatApp } from './chat.app';
import { Observable, Subject, map } from 'rxjs';
import { EventEmitter } from 'stream';

@Controller("chat")
export class ChatController {
	
	constructor (
		private readonly service: ChatService,
		private readonly eventService: EventEmitter) {}
	
	@Get()
	GetChatWebApp()
		: string
			{ return ChatApp.GetWebApp() }
	
	//#region Get
	
	@Get("user/:userID")
	GetChatUser(
		@Param("userID") userID: string)
		: Promise<ChatUser>
			{ return this.service.GetOrAddUser(userID) }
	
	@Get("user/:userID/:info")
	async GetChatUserInfo(
		@Param("userID") userID: string,
		@Param("info") info: string)
		: Promise<ChatUser>
			{ return (await this.service.GetOrAddUser(userID))[info] }
	
	@Get("room/:roomID")
	GetRoom(
		@Param("roomID") roomID: string)
		: Promise<ChatRoom>
			{ return this.service.GetRoom(roomID) }
	
	@Get("room/:roomID/:info")
	async GetRoomInfo(
		@Param("roomID") roomID: string,
		@Param("info") info: string)
		: Promise<any>
			{ return (await this.service.GetRoom(roomID))[info] }
	
	@Get("msg/:roomID/:index")
	GetMessageGroup(
		@Param("roomID") roomID: string,
		@Param("index") index: number)
		: Promise<ChatMessage[]>
			{ return this.service.GetMessages(roomID, +index) }
	
	//#endregion
	
	@Post("room")
	async MakeNewRoom(
		@Body() room: ChatRoomDTO)
		: Promise<ChatRoom>
			{ return await this.service.NewRoom(room) }
	
	@Post("msg/:roomID")
	async PostNewMessage(
		@Param("roomID") roomID: string,
		@Body() msg: ChatMessageDTO)
		: Promise<string> {
			const ret = await this.service.PostNewMessage(roomID, msg)
			this.eventService.emit("RoomUpdate", roomID)
			return ret
		}
	
	@Post("room/:roomID/:userID")
	async AddUser(
		@Param("roomID") roomID: string,
		@Param("userID") userID: string,)
		: Promise<void> {
			await this.service.AddUserToRoom(roomID, userID)
			this.eventService.emit("RoomUpdate", roomID)
		}
	
	@Delete("room/:roomID")
	DeleteRoom(
		@Param("roomID") roomID: string)
		: string
			{ this.service.DeleteRoom(roomID); return "All gone!" }
	
	@Delete("user/:userID")
	DeleteUser(
		@Param("userID") userID: string)
		: string
			{ this.service.DeleteUser(userID); return "All gone!" }
	
	@Sse('event/:roomID')
	NotifyClientOfUpdate(@Param("roomID") roomID: string): Observable<string> {
		const subject$ = new Subject()
		
		this.eventService.on("RoomUpdate", updatedRoomID => {
			if (updatedRoomID === roomID) {
				subject$.next("r")
				console.log("update")
			}
		})
		
		return subject$.pipe(map((msg: string): string => msg))
	}
	
	//#region Debug
	
	@Get("users")
	GetChatUsers()
		: Promise<ChatUser[]>
			{ return this.service.GetAllUsers() }
	
	@Get("rooms")
	GetChatRooms()
		: Promise<ChatRoom[]>
			{ return this.service.GetAllRooms() }
	
	@Delete("all")
	DeleteAll()
		: string
			{ this.service.DeleteAll(); return "All gone!" }
	
	//#endregion
}
