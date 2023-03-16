import { Controller, Get, Post, Patch, Delete, Body, Param, Sse, Headers, Req, Request, Response, StreamableFile, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat_entities/chat_message';
import { ChatRoom, ChatRoomPreview } from './chat_entities/chat_room';
import { ChatUser } from './chat_entities/chat_user';
import { ChatMessageDTO } from './dto/chat_message.dto';
import { ChatRoomDTO } from './dto/chat_room.dto';
import { ChatApp } from './chat.app';
import { Observable } from 'rxjs';
import { createReadStream } from "fs"
import { join } from 'path';
import { lookup } from 'mime-types';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from 'src/auth/auth.guard';

@Controller("chat")
export class ChatController {
	
	constructor (
		private readonly service: ChatService) {}
	
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
			{ return this.service.GetOrAddUser(userID).then(user => user[info]) }
	
	@Get("public")
	async GetPublicRooms()
		: Promise<ChatRoomPreview[]>
			{ return this.service.GetPublicRooms() }
	
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
			{ return this.service.GetRoom(roomID).then(room => room[info]) }
	
	@Get("msg/:roomID/:index")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	GetMessageGroup(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("index") index: string)
		: Promise<ChatMessage[]>
			{ return this.service.GetMessages(roomID, +index, req["user"].id) }
	
	//#endregion
	
	//#region Post
	
	@Post("direct/:memberID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async MakeDirectMessageGroup(
		@Request() req: Request,
		@Param("memberID") memberID: string)
		: Promise<string>
			{ return this.service.NewDirect(req["user"].id, memberID) }
	
	@Post("room")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async MakeNewRoom(
		@Request() req: Request,
		@Body() room: ChatRoomDTO)
		: Promise<string>
			{ return this.service.NewRoom(room, req["user"].id) }
	
	@Post("msg/:roomID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async PostNewMessage(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Body() msg: ChatMessageDTO)
		: Promise<string>
			{ return this.service.PostNewMessage(roomID, msg, req["user"].id) }
	
	//#endregion
	
	//#region Patch
	
	@Patch("room/:roomID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async EditRoom(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Body() room: ChatRoomDTO)
		: Promise<void>
			{ await this.service.EditRoom(roomID, room, req["user"].id) }
	
	@Patch("admin/:roomID/:memberID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async MakeAdmin(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("memberID") memberID: string)
		: Promise<boolean>
			{ return this.service.MakeAdmin(roomID, memberID, req["user"].id) }
	
	@Patch("join/:roomID/:pass")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async JoinRoom(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("pass") pass: string)
		: Promise<string>
			{ return this.service.AddUserToRoom(roomID, req["user"].id, pass) }
	
	@Patch("room/:roomID/:userID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async AddUser(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("userID") userID: string,)
		: Promise<void>
			{ this.service.AddUserToRoom(roomID, userID, "", req["user"].id) }
	
	@Patch("unban/:roomID/:userID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async UnBan(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("userID") userID: string)
		: Promise<boolean>
			{ return this.service.UnBan(roomID, userID, req["user"].id) }
	
	@Patch("mute/:roomID/:userID/:time")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async Mute(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("userID") userID: string,
		@Param("time") time: string)
		: Promise<boolean>
			{ return this.service.Mute(roomID, userID, +time, req["user"].id) }
	
	@Patch("mute/:roomID/:userID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async UnMute(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("userID") userID: string)
		: Promise<boolean>
			{ return this.service.UnMute(roomID, userID, req["user"].id) }
	
	//#endregion
	
	//#region Delete
	
	@Delete("member/:roomID/:memberID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async KickMember(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("memberID") memberID: string,)
		: Promise<boolean>
			{ return this.service.RemoveMember(roomID, memberID, false, req["user"].id) }
	
	@Delete("ban/:roomID/:memberID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async BanMember(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("memberID") memberID: string,)
		: Promise<boolean>
			{ return this.service.RemoveMember(roomID, memberID, true, req["user"].id)}
	
	@Delete("admin/:roomID/:memberID")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async RemoveAdmin(
		@Request() req: Request,
		@Param("roomID") roomID: string,
		@Param("memberID") memberID: string,)
		: Promise<boolean>
			{ return this.service.RemoveAdmin(roomID, memberID, req["user"].id) }
	
	@Delete("user")
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	async DeleteUser(
		@Request() req: Request)
		: Promise<void>
			{ await this.service.DeleteUser(req["user"].id) }
	
	//#endregion
	
	//#region Server Sent Notifications
	
	@Sse('event/:ID')
	NotifyClientOfRoomUpdate(
		@Param("ID") ID: string)
		: Observable<string>
			{ return this.service.SubscribeTo(ID) }
	
	//#endregion
	
	//#region Debug
	
	@Post("friends")
	async _friends()
		: Promise<void>
			{ await this.service._friends() }
	
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
