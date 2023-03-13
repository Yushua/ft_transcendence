import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeStamp } from 'console';
import { Repository } from 'typeorm';
import { ChatMessage, ChatMessageGroupManager } from './chat_entities/chat_message';
import { ChatRoom, ChatRoomPassword, ChatRoomPreview, ChatRoomType } from './chat_entities/chat_room';
import { ChatUser } from './chat_entities/chat_user';
import { ChatMessageDTO } from './dto/chat_message.dto';
import { ChatRoomDTO } from './dto/chat_room.dto';
import { Observable, Subject, map } from 'rxjs';
import { UserProfile } from 'src/user-profile/user.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoom)
			private readonly chatRoomRepo: Repository<ChatRoom>,
		@InjectRepository(ChatRoomPassword)
			private readonly chatRoomPassRepo: Repository<ChatRoomPassword>,
		@InjectRepository(ChatMessageGroupManager)
			private readonly chatMessageRepo: Repository<ChatMessageGroupManager>,
		@InjectRepository(ChatUser)
			private readonly chatUserRepo: Repository<ChatUser>,
		@InjectRepository(UserProfile)
			private readonly userProfileRepo: Repository<UserProfile>,
	) {}
	
	//#region RoomBackEnd
	
	async GetRoomPassword(roomID: string): Promise<ChatRoomPassword> {
		return this.chatRoomPassRepo.findOneBy({ ID: roomID })
	}
	
	private async _getMsgID(roomID: string, index: number, room: ChatRoom | null = null): Promise<string> {
		if (index < 0) {
			if (!room)
				room = await this.GetRoom(roomID)
			index = room.MessageGroupDepth + index + 1
		}
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
	
	async EditRoom(roomID: string, roomDTO: ChatRoomDTO, userID: string): Promise<void> {
		
		const { OwnerID, Name, Password, RoomType } =  roomDTO
		
		if (OwnerID !== userID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		const [room, changed] = await this.ModifyRoom(roomID, async room => {
			if (room.OwnerID !== userID)
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			room.Name = Name
			room.HasPassword = Password !== ""
			room.RoomType = +ChatRoomType[RoomType]
			var roomPass = await this.GetRoomPassword(roomID)
			roomPass.Password = Password
			await this.chatRoomPassRepo.save(roomPass)
			return true
		})
		if (!changed)
			return
		for (const userID of room.MemberIDs)
			this.Notify(`user-${userID}`, "room")
		this.Notify(`room-${roomID}`, "room")
	}
	
	async UnBan(roomID: string, userID: string, adminID: string): Promise<void> {
		const [room, changed] = await this.ModifyRoom(roomID, async room => {
			if (!room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			const index = room.BanIDs.indexOf(userID);
			if (index === -1)
				return false
			room.BanIDs.splice(index, 1);
			return true
		})
		if (changed)
			this.Notify(`room-${roomID}`, "mem")
	}
	
	async Mute(roomID: string, userID: string, time: number, adminID: string): Promise<void> {
		if (!Number.isInteger(time))
			throw new HttpException(`"${time}" is not an integer`, HttpStatus.BAD_REQUEST)
		if (time > 7 * 1000 * 60 * 60 * 24)
			throw new HttpException(`Can't mute someone for longer then a week!`, HttpStatus.BAD_REQUEST)
		await this.ModifyRoom(roomID, async room => {
			if (!room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			if (room.OwnerID === userID
				|| room.AdminIDs.includes(userID))
				return false
			
			const index = room.MuteIDs.indexOf(userID)
			if (index !== -1)
				room.MuteDates[index] = (Date.now() + time).toString()
			else {
				room.MuteIDs.push(userID)
				room.MuteDates.push((Date.now() + time).toString())
			}
			return true
		})
	}
	
	async UnMute(roomID: string, userID: string, adminID: string): Promise<void> {
		await this.ModifyRoom(roomID, async room => {
			if (!room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			const index = room.MuteIDs.indexOf(userID)
			if (index !== -1)
				return false
			room.MuteIDs.splice(index, 1)
			room.MuteDates.splice(index, 1)
			return true
		})
	}
	
	async NewDirect(userID: string, memberID: string): Promise<string> {
		var user = await this.GetOrAddUser(userID)
		if (user.FriedsWithDirect.includes(memberID))
			return
		
		var room = await this.chatRoomRepo.create({
			OwnerID:"", Name:"", HasPassword: false, RoomType: +ChatRoomType.Private,
			MemberIDs:[userID, memberID], AdminIDs:[],
			BanIDs:[], MuteIDs:[], MuteDates:[],
			MessageGroupDepth: 0, MessageCount: 0, Direct: true
		})
		room = await this.chatRoomRepo.save(room)
		
		user.DirectChatsIn.push(room.ID)
		user.FriedsWithDirect.push(memberID)
		await this.chatUserRepo.save(user)
		
		await this.ModifyUser(memberID, async user => {
			user.DirectChatsIn.push(room.ID)
			user.FriedsWithDirect.push(userID)
			return true
		})
		
		this.Notify(`user-${memberID}`, "room")
		
		return room.ID
	}
	
	async NewRoom(roomDTO: ChatRoomDTO, userID: string): Promise<string> {
		
		const { OwnerID, Name, Password, RoomType } =  roomDTO
		
		if (OwnerID !== userID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		var room = await this.chatRoomRepo.create({
			OwnerID, Name, HasPassword: Password !== "", RoomType: +ChatRoomType[RoomType],
			MemberIDs:[OwnerID], AdminIDs:[OwnerID],
			BanIDs:[], MuteIDs:[], MuteDates:[],
			MessageGroupDepth: 0, MessageCount: 0, Direct: false
		})
		room = await this.chatRoomRepo.save(room)
		
		await this.chatRoomPassRepo.save(await this.chatRoomPassRepo.create({
			ID: room.ID, Password: Password
		}))
		
		await this.ModifyUser(OwnerID, async user => {
			user.ChatRoomsIn.push(room.ID)
			return true
		})
		
		return room.ID
	}
	
	async GetMessages(roomID: string, index: number, userID: string): Promise<ChatMessage[]> {
		if (!Number.isInteger(index))
			throw `${index} is not an integer`;
		const room = await this.GetRoom(roomID);
		if (!room.MemberIDs.includes(userID))
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		const msgGroupManager = await this.chatMessageRepo.findOneBy({ ID: await this._getMsgID(roomID, index, room) })
		if (!msgGroupManager)
			return []
		return msgGroupManager.ToMessages()
	}
	
	async PostNewMessage(roomID: string, msgDTO: ChatMessageDTO, userID: string): Promise<string> {
		
		const { OwnerID, Message } = msgDTO
		
		console.log(`${OwnerID} ${userID}`)
		
		if (OwnerID !== userID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		const msg = new ChatMessage(OwnerID, Message)
		
		const room = await this.GetRoom(roomID)
		const index = room.MuteIDs.indexOf(OwnerID)
		if (index !== -1) {
			const date = room.MuteDates[index]
			if (+date > Date.now())
				return date
			room.MuteIDs.splice(index, 1)
			room.MuteDates.splice(index, 1)
		}
		
		room.MessageCount += 1
		
		var depth = room.MessageGroupDepth
		var msgGroup = await this.chatMessageRepo.findOneBy({ ID: await this._getMsgID(room.ID, depth) })
		if (!msgGroup || !msgGroup.AddMessage(msg)) {
			depth = (room.MessageGroupDepth += 1)
			msgGroup = await this._addMessageGroup(await this._getMsgID(room.ID, depth))
			msgGroup.AddMessage(msg)
		}
		await this.chatRoomRepo.save(room)
		await this.chatMessageRepo.save(msgGroup)
		this.Notify("room-" + roomID, ChatMessageDTO.toString())
		return ""
	}
	
	async AddUserToRoom(roomID: string, userID: string, password: string | null, memberID: string = ""): Promise<string> {
		const [room, changed] = await this.ModifyRoom(roomID, async room => {
			if (!!password) {
				if (room.HasPassword && (await this.GetRoomPassword(roomID)).Password !== password)
					return false
			}
			else if (!room.MemberIDs.includes(memberID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			if (room.BanIDs.includes(userID) || room.MemberIDs.includes(userID))
				return false
			room.MemberIDs.push(userID)
			await this.ModifyUser(userID, async user => {
				user.ChatRoomsIn.push(roomID)
				return true
			})
			return true
		})
		if (!changed)
			return ""
		this.Notify(`room-${roomID}`, "mem")
		this.Notify(`user-${userID}`, "room")
		return roomID
	}
	
	async GetPublicRooms(): Promise<ChatRoomPreview[]> {
		return (await this.chatRoomRepo.findBy({RoomType: +ChatRoomType.Public}))
			.map(room => new ChatRoomPreview(room.ID, room.Name, room.HasPassword, room.BanIDs))
		
	}
	
	async GetRoom(roomID: string): Promise<ChatRoom>
		{ return this.chatRoomRepo.findOneBy({ ID: roomID }) }
	
	async ModifyRoom(roomID: string, func: (ChatUser: ChatRoom) => Promise<boolean>): Promise<[ChatRoom, boolean]> {
		var room = await this.GetRoom(roomID)
		var changed = await func(room)
		if (changed)
			room = await this.chatRoomRepo.save(room)
		return [room, changed]
	}
	
	//#endregion
	
	//#region User
	
	async GetOrAddUser(userID: string): Promise<ChatUser> {
		var user = await this.chatUserRepo.findOneBy({ ID: userID })
		if (!!user)
			return user
		return await this.chatUserRepo.save(await this.chatUserRepo.create({
			ID: userID, ChatRoomsIn:[], DirectChatsIn:[], FriedsWithDirect:[], BlockedUserIDs:[]
		}))
	}
	
	async ModifyUser(ID: string, func: (ChatUser: ChatUser) => Promise<boolean>): Promise<[ChatUser, boolean]> {
		var user = await this.GetOrAddUser(ID)
		const changed = await func(user)
		if (changed)
			user = await this.chatUserRepo.save(user)
		return [user, changed]
	}
	
	async MakeAdmin(roomID: string, memberID: string, userID: string): Promise<void> {
		const [_, changed] = await this.ModifyRoom(roomID, async room => {
			if (!room.AdminIDs.includes(userID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			if (!room.AdminIDs.includes(memberID) && room.MemberIDs.includes(memberID)) {
				room.AdminIDs.push(memberID)
				return true
			}
			return false
		})
		if (changed)
			this.Notify("room-" + roomID, "mem")
	}
	
	async RemoveAdmin(roomID: string, memberID: string, adminID: string): Promise<void> {
		const [room, changed] = await this.ModifyRoom(roomID, async room => {
			if (!room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			var index = room.AdminIDs.indexOf(memberID);
			if (index === -1)
				return false
			room.AdminIDs.splice(index, 1);
			return true
		})
		if (changed)
			this.Notify(`room-${roomID}`, "mem")
	}
	
	async RemoveMember(roomID: string, memberID: string, ban: boolean = false, adminID: string | null): Promise<void> {
		const [room, changed] = await this.ModifyRoom(roomID, async room => {
			if (!!adminID && !room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			if (room.OwnerID === memberID
				|| room.AdminIDs.includes(memberID))
				return false
			
			var index = room.MemberIDs.indexOf(memberID);
			if (index === -1)
				return false
			room.MemberIDs.splice(index, 1)
			if (ban && !room.BanIDs.includes(memberID))
				room.BanIDs.push(memberID)
			
			await this.ModifyUser(memberID, async user => {
				const index = user.ChatRoomsIn.indexOf(roomID);
				if (index === -1)
					return false
				user.ChatRoomsIn.splice(index, 1)
				return true
			})
			
			return true
		})
		if (changed) {
			this.Notify(`room-${roomID}`, "mem")
			this.Notify(`user-${memberID}`, "kick")
		}
	}
	
	async DeleteUser(userID: string): Promise<void> {
		const user = await this.chatUserRepo.findOneBy({ ID: userID })
		for (const roomID of user.ChatRoomsIn)
			await this.RemoveMember(roomID, userID, false, null)
		await this.chatUserRepo.remove(user)
	}
	
	//#endregion
	
	//#region Debug
	
	async _friends() {
		var users = await this.userProfileRepo.find()
		for (const user of users) {
			for (const other of users) {
				if (user === other)
					continue
				user.friendList.push(other.id)
			}
			await this.userProfileRepo.save(user)
		}
	}
	
	async GetAllUsers(): Promise<ChatUser[]>
		{ return this.chatUserRepo.find() }
	
	async GetAllRooms(): Promise<ChatRoom[]>
		{ return this.chatRoomRepo.find() }
	
	async DeleteAll(): Promise<void> {
		await this.chatRoomRepo.delete({})
		await this.chatUserRepo.delete({})
		await this.chatMessageRepo.delete({})
		await this.chatRoomPassRepo.delete({})
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
