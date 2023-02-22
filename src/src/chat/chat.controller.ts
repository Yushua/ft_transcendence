import { Controller, Get, Post, Patch, Delete, Body, Param, Sse, Headers, Req, Request, Response, StreamableFile } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat_objects/chat_message';
import { ChatRoom } from './chat_objects/chat_room';
import { ChatUser } from './chat_objects/chat_user';
import { ChatMessageDTO } from './dto/chat_message.dto';
import { ChatRoomDTO } from './dto/chat_room.dto';
import { ChatApp } from './chat.app';
import { Observable } from 'rxjs';
import { createReadStream } from "fs"
import { join } from 'path';
import { lookup } from 'mime-types';

@Controller("chat")
export class ChatController {
	
	constructor (
		private readonly service: ChatService) {}
	
	@Get("app/*")
	GetRedirectToWebApp(
		@Req() request: Request,
		@Response({ passthrough: true }) response)
			{ return ChatApp.GetWebAppFiles(request.url.substring(9), response)}
	
	@Get()
	GetChatWebApp(
		@Response({ passthrough: true }) response)
			{ return ChatApp.GetWebAppFiles("index.html", response) }
	
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
		: Promise<any> {
			const room = await this.service.GetRoom(roomID)
			if (!room)
				return null
			return room[info]
		}
	
	@Get("msg/:roomID/:index")
	GetMessageGroup(
		@Param("roomID") roomID: string,
		@Param("index") index: number)
		: Promise<ChatMessage[]>
			{ return this.service.GetMessages(roomID, +index) }
	
	//#endregion
	
	//#region Post
	
	@Post("friends")
	async _friends()
		: Promise<void>
			{ await this.service._friends() }
	
	@Post("direct/:userID/:memberID")
	async MakeDirectMessageGroup(
		@Param("userID") userID: string,
		@Param("memberID") memberID: string)
		: Promise<string>
			{ return await this.service.NewDirect(userID, memberID) }
	
	@Post("room")
	async MakeNewRoom(
		@Body() room: ChatRoomDTO)
		: Promise<string>
			{ return await this.service.NewRoom(room) }
	
	@Post("msg/:roomID")
	async PostNewMessage(
		@Param("roomID") roomID: string,
		@Body() msg: ChatMessageDTO)
		: Promise<string> {
			const ret = await this.service.PostNewMessage(roomID, msg)
			this.service.Notify("room-" + roomID, "msg")
			return ret
		}
	
	@Post("admin/:roomID/:userID")
	async MakeAdmin(
		@Param("roomID") roomID: string,
		@Param("userID") userID: string)
		: Promise<void>
			{ await this.service.MakeAdmin(roomID, userID) }
	
	@Post("room/:roomID/:userID")
	async AddUser(
		@Param("roomID") roomID: string,
		@Param("userID") userID: string,)
		: Promise<void>
			{ await this.service.AddUserToRoom(roomID, userID) }
	
	@Post("unban/:roomID/:userID")
	async UnBan(
		@Param("roomID") roomID: string,
		@Param("userID") userID: string)
		: Promise<void>
			{ await this.service.UnBan(roomID, userID) }
	
	//#endregion
	
	//#region Delete
	
	@Delete("member/:roomID/:memberID")
	async KickMember(
		@Param("roomID") roomID: string,
		@Param("memberID") memberID: string,)
		: Promise<void>
			{ await this.service.RemoveMember(roomID, memberID) }
	
	@Delete("ban/:roomID/:memberID")
	async BanMember(
		@Param("roomID") roomID: string,
		@Param("memberID") memberID: string,)
		: Promise<void>
			{ await this.service.RemoveMember(roomID, memberID, true)}
	
	@Delete("admin/:roomID/:memberID")
	async RemoveAdmin(
		@Param("roomID") roomID: string,
		@Param("memberID") memberID: string,)
		: Promise<void>
			{ await this.service.RemoveAdmin(roomID, memberID) }
	
	@Delete("user/:userID")
	async DeleteUser(
		@Param("userID") userID: string)
		: Promise<void>
			{ await this.service.DeleteUser(userID) }
	
	//#endregion
	
	//#region Server Sent Notifications
	
	@Sse('event/:ID')
	NotifyClientOfRoomUpdate(
		@Param("ID") ID: string)
		: Observable<string>
			{ return this.service.SubscribeTo(ID) }
	
	//#endregion
	
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
