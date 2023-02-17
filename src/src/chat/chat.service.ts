import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeStamp } from 'console';
import { Repository } from 'typeorm';
import { ChatMessage, ChatMessageGroupManager } from './chat_objects/chat_message';
import { ChatRoom, ChatRoomType } from './chat_objects/chat_room';
import { ChatUser } from './chat_objects/chat_user';
import { ChatMessageDTO } from './dto/chat_message.dto';
import { ChatRoomDTO } from './dto/chat_room.dto';
import { Observable, Subject, map } from 'rxjs';
import { UserProfile } from 'src/user-profile/user.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoom)
			private readonly chatRoomRepo: Repository<ChatRoom>,
		@InjectRepository(ChatMessageGroupManager)
			private readonly chatMessageRepo: Repository<ChatMessageGroupManager>,
		@InjectRepository(ChatUser)
			private readonly chatUserRepo: Repository<ChatUser>,
		@InjectRepository(UserProfile)
			private readonly userProfileRepo: Repository<UserProfile>,
	) {}
	
	//#region RoomBackEnd
	
	private async _getMsgID(roomID: string, index: number): Promise<string> {
		if (index < 0)
			index = (await this.GetRoom(roomID)).MessageGroupDepth + index + 1
		return `${roomID}__${index}`
	}
	
	private async _addMessageGroup(roomID: string): Promise<ChatMessageGroupManager> {
		
		const msgGroup = await this.chatMessageRepo.create({
			ID:           roomID,
			OwnerIDs:     [],
			Messages:     [],
			MessageCount: 0
		})
		
		return await this.chatMessageRepo.save(msgGroup)
	}
	
	//#endregion
	
	//#region RoomFrontEnd
	
	async NewRoom(roomDTO: ChatRoomDTO): Promise<ChatRoom> {
		
		const { OwnerID, Password, RoomType } =  roomDTO
		var room = await this.chatRoomRepo.create({
			OwnerID, Password, RoomType: +ChatRoomType[RoomType],
			MemberIDs:[OwnerID], AdminIDs:[OwnerID],
			BanIDs:[], MuteIDs:[], MuteDates:[],
			MessageGroupDepth: 0
		})
		room = await this.chatRoomRepo.save(room)
		
		await this._modifyUser(OwnerID, user => {user.ChatRoomsIn.push(room.ID)})
		
		return room
	}
	
	async GetMessages(roomID: string, index: number): Promise<ChatMessage[]> {
		if (!Number.isInteger(index))
			throw `${index} is not an integer`;
		const msgGroupManager = await this.chatMessageRepo.findOneBy({ ID: await this._getMsgID(roomID, index) })
		if (!msgGroupManager)
			return []
		return msgGroupManager.ToMessages()
	}
	
	async PostNewMessage(roomID: string, msgDTO: ChatMessageDTO): Promise<string> {
		
		const { OwnerID, Message } = msgDTO
		const msg = new ChatMessage(OwnerID, Message)
		
		const room = await this.GetRoom(roomID)
		
		var depth = room.MessageGroupDepth
		var msgGroup = await this.chatMessageRepo.findOneBy({ ID: await this._getMsgID(room.ID, depth) })
		if (!msgGroup || !msgGroup.AddMessage(msg)) {
			depth = (room.MessageGroupDepth += 1)
			await this.chatRoomRepo.save(room)
			msgGroup = await this._addMessageGroup(await this._getMsgID(room.ID, depth))
			msgGroup.AddMessage(msg)
		}
		await this.chatMessageRepo.save(msgGroup)
		return msgGroup.ID
	}
	
	async AddUserToRoom(roomID: string, userID: string) {
		await this._modifyRoom(roomID, async room => {
			if (!room.MemberIDs.includes(userID)) {
				room.MemberIDs.push(userID)
				await this._modifyUser(userID, user => {
					user.ChatRoomsIn.push(roomID)
				})
			}
		})
	}
	
	async GetRoom(roomID: string): Promise<ChatRoom>
		{ return this.chatRoomRepo.findOneBy({ ID: roomID }) }
	
	private async _modifyRoom(roomID: string, func: (ChatUser: ChatRoom) => void): Promise<ChatRoom> {
		const room = await this.GetRoom(roomID)
		func(room)
		return await this.chatRoomRepo.save(room)
	}
	
	async DeleteRoom(roomID: string): Promise<void> {
		const room = await this.GetRoom(roomID)
		for (let i: number = 0; i < room.MessageGroupDepth; i++)
			this.chatMessageRepo.delete({ ID: await this._getMsgID(roomID, i + 1) })
		for (const userID of room.MemberIDs) {
			this._modifyUser(userID, user => {
				const index = user.ChatRoomsIn.indexOf(roomID, 0);
				if (index > -1)
					user.ChatRoomsIn.splice(index, 1);
			})
		}
		this.chatRoomRepo.remove(room)
	}
	
	//#endregion
	
	//#region User
	
	async GetOrAddUser(userID: string): Promise<ChatUser> {
		var user = await this.chatUserRepo.findOneBy({ ID: userID })
		if (user)
			return user
		return await this.chatUserRepo.save(await this.chatUserRepo.create({
			ID: userID, ChatRoomsIn:[], DirectChatsIn:[], BlockedUserIDs:[]
		}))
	}
	
	private async _modifyUser(ID: string, func: (ChatUser: ChatUser) => void): Promise<ChatUser> {
		var user = await this.GetOrAddUser(ID)
		func(user)
		return await this.chatUserRepo.save(user)
	}
	
	async MakeAdmin(roomID: string, userID: string): Promise<boolean> {
		var changed = false
		await this._modifyRoom(roomID, room => {
			if (!room.AdminIDs.includes(userID) && room.MemberIDs.includes(userID)) {
				room.AdminIDs.push(userID)
				changed = true
			}
		})
		return changed
	}
	
	async KickMember(roomID: string, memberID: string): Promise<void> {
		const room = await this.GetRoom(roomID)
		if (room.OwnerID == memberID)
			return
		
		var roomToDelete: string = null
		await this._modifyUser(memberID, user => {
			const index = user.ChatRoomsIn.indexOf(roomID, 0);
			if (index > -1)
				user.ChatRoomsIn.splice(index, 1);
		})
		await this._modifyRoom(roomID, async room => {
			var index
			
			index = room.MemberIDs.indexOf(memberID, 0);
			if (index > -1)
				room.MemberIDs.splice(index, 1);
			
			index = room.AdminIDs.indexOf(memberID, 0);
			if (index > -1)
				room.AdminIDs.splice(index, 1);
		})
		if (!!roomToDelete)
			await this.DeleteRoom(roomToDelete)
	}
	
	async DeleteUser(userID: string): Promise<void> {
		const user = await this.chatUserRepo.findOneBy({ ID: userID })
		for (const roomID of user.ChatRoomsIn)
			await this.KickMember(roomID, userID)
		await this.chatUserRepo.remove(user)
	}
	
	//#endregion
	
	//#region Debug
	
	async GetAllUsers(): Promise<ChatUser[]>
		{ return this.chatUserRepo.find() }
	
	async GetAllRooms(): Promise<ChatRoom[]>
		{ return this.chatRoomRepo.find() }
	
	async DeleteAll(): Promise<void> {
		await this.chatRoomRepo.delete({})
		await this.chatUserRepo.delete({})
		await this.chatMessageRepo.delete({})
	}
	
	//#endregion

	//#region EventSystem
	
	private Subjects = {}
	SubscribeTo(ID: string): Observable<string> {
		var sub: Subject<string> = this.Subjects[ID]
		// console.log(`${!!sub?"[SUB]":"[NEW]"} ${ID.substring(0, 4)}`)
		if (!sub)
			sub = (this.Subjects[ID] = new Subject<string>())
		return sub.pipe(map((data: string): string => data))
	}
	
	Notify(ID: string, msg: string) {
		// console.log(`< < < ${ID.substring(0, 4)} ${msg}`)
		var sub: Subject<string> = this.Subjects[ID]
		if (!!sub)
			sub.next(msg)
	}
	
	//#endregion
}
