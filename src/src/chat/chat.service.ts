import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeStamp } from 'console';
import { Repository } from 'typeorm';
import { ChatMessage, ChatMessageGroupManager } from './chat_objects/chat_message';
import { ChatRoom, ChatRoomType } from './chat_objects/chat_room';
import { ChatUser } from './chat_objects/chat_user';
import { ChatMessageDTO } from './dto/chat_message.dto';
import { ChatRoomDTO } from './dto/chat_room.dto';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoom)
			private readonly chatRoomRepo: Repository<ChatRoom>,
		@InjectRepository(ChatMessageGroupManager)
			private readonly chatMessageRepo: Repository<ChatMessageGroupManager>,
		@InjectRepository(ChatUser)
			private readonly chatUserRepo: Repository<ChatUser>,
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
		
		return this.chatMessageRepo.save(msgGroup)
	}
	
	//#endregion
	
	//#region RoomFrontEnd
	
	async NewRoom(roomDTO: ChatRoomDTO): Promise<ChatRoom> {
		
		const { OwnerID, Password, RoomType } =  roomDTO
		var room = await this.chatRoomRepo.create({
			OwnerID, Password, RoomType: +ChatRoomType[RoomType],
			MemberIDs:[OwnerID], AdminIDs:[OwnerID], BlackList:[],
			MessageGroupDepth: 0
		})
		room = await this.chatRoomRepo.save(room)
		
		await this.ModifyUser(OwnerID, user => {user.ChatRoomsIn.push(room.ID)})
		
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
		this.chatMessageRepo.save(msgGroup)
		return msgGroup.ID
	}
	
	async GetRoom(roomID: string): Promise<ChatRoom>
		{ return await this.chatRoomRepo.findOneBy({ ID: roomID }) }
	
	async ModifyRoom(roomID: string, func: (ChatUser: ChatRoom) => void): Promise<ChatRoom> {
		const room = await this.GetRoom(roomID)
		func(room)
		return this.chatRoomRepo.save(room)
	}
	
	async DeleteRoom(roomID: string): Promise<void> {
		const room = await this.GetRoom(roomID)
		for (let i: number = 0; i < room.MessageGroupDepth; i++)
			this.chatMessageRepo.delete({ ID: await this._getMsgID(roomID, i + 1) })
		for (const userID of room.MemberIDs) {
			this.ModifyUser(userID, user => {
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
		var foudUser = await this.chatUserRepo.findOneBy({ ID: userID })
		if (foudUser)
			return foudUser
		return await this.chatUserRepo.save(await this.chatUserRepo.create({ ID: userID, ChatRoomsIn:[], BlockedUserIDs:[] }))
	}
	
	async ModifyUser(ID: string, func: (ChatUser: ChatUser) => void): Promise<ChatUser> {
		var foudUser = await this.GetOrAddUser(ID)
		func(foudUser)
		return this.chatUserRepo.save(foudUser)
	}
	
	async DeleteUser(userID: string): Promise<void> {
		const user = await this.chatUserRepo.findOneBy({ ID: userID })
		if (!user)
			return
		const roomsToDelete: string[] = []
		for (const roomID of user.ChatRoomsIn) {
			await this.ModifyRoom(roomID, room => {
				var index
				
				index = room.MemberIDs.indexOf(userID, 0);
				if (index > -1)
					room.MemberIDs.splice(index, 1);
				
				index = room.AdminIDs.indexOf(userID, 0);
				if (index > -1)
					room.AdminIDs.splice(index, 1);
				
				if (room.OwnerID == userID) {
					if (room.MemberIDs.length == 0)
						roomsToDelete.push(roomID)
					else
						room.OwnerID = room.MemberIDs[0]
				}
			})
		}
		for (const roomID of roomsToDelete)
			await this.DeleteRoom(roomID)
		await this.chatUserRepo.remove(user)
	}
	
	//#endregion
	
	//#region Debug
	
	async GetAllUsers(): Promise<ChatUser[]>
		{ return await this.chatUserRepo.find() }
	
	async GetAllRooms(): Promise<ChatRoom[]>
		{ return await  this.chatRoomRepo.find() }
	
	async DeleteAll(): Promise<void> {
		this.chatRoomRepo.delete({})
		this.chatUserRepo.delete({})
		this.chatMessageRepo.delete({})
	}
	
	//#endregion
}
