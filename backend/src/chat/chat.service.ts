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
import * as bcrypt from 'bcrypt'

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
	
	private async _getMsgID(roomID: string, index: number, room: ChatRoom | null = null): Promise<string> {
		if (index < 0) {
			if (!room)
				room = await this.GetRoom(roomID)
			index = room.MessageGroupDepth + index + 1
		}
		return `${roomID}__${index}`
	}
	
	private async _addMessageGroup(roomID: string): Promise<ChatMessageGroupManager> {
		return this.chatMessageRepo.save(this.chatMessageRepo.create({
			ID:           roomID,
			OwnerIDs:     [],
			Messages:     [],
			MessageCount: 0
		}))
	}
	
	async EditRoom(roomID: string, roomDTO: ChatRoomDTO, userID: string): Promise<void> {
		
		const { OwnerID, Name, HasPassword, Password, RoomType } =  roomDTO
		
		if (OwnerID !== userID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		const [room, changed] = await this.ModifyRoom(roomID, async room => {
			if (room.OwnerID !== userID)
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			room.Name = Name
			room.RoomType = +ChatRoomType[RoomType]
			
			if (HasPassword === 'f')
				return true
			room.HasPassword = Password !== ""
			await this.chatRoomPassRepo.findOneBy({ID: roomID})
				.then(async rPass => {
					rPass.Password = room.HasPassword ? await bcrypt.hash(Password, 10) : "";
					return this.chatRoomPassRepo.save(rPass)
				})
			return true
		})
		console.log(`${room.HasPassword}`)
		if (!changed)
			return
		for (const userID of room.MemberIDs)
			this.Notify(`user-${userID}`, "room")
		this.Notify(`room-${roomID}`, "room")
	}
	
	async UnBan(roomID: string, userID: string, adminID: string): Promise<boolean> {
		const [_, changed] = await this.ModifyRoom(roomID, async (room) => {
			if (!room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)

			const index = room.BanIDs.indexOf(userID)
			if (index === -1)
				return false
			room.BanIDs.splice(index, 1)
			return true
		})
		if (changed)
			this.Notify(`room-${roomID}`, "mem")
		return changed
	}
	
	async Mute(roomID: string, userID: string, time: number, adminID: string): Promise<boolean> {
		if (!Number.isInteger(time))
			throw new HttpException(`"${time}" is not an integer`, HttpStatus.BAD_REQUEST)
		if (time > 7 * 1000 * 60 * 60 * 24)
			throw new HttpException(`Can't mute someone for longer then a week!`, HttpStatus.BAD_REQUEST)
		
		const [_, changed] = await this.ModifyRoom(roomID, async (room) => {
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
		return changed
	}
	
	async UnMute(roomID: string, userID: string, adminID: string): Promise<boolean> {
		const [_, changed] = await this.ModifyRoom(roomID, async (room) => {
			if (!room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)

			const index = room.MuteIDs.indexOf(userID)
			if (index !== -1)
				return false
			room.MuteIDs.splice(index, 1)
			room.MuteDates.splice(index, 1)
			return true
		})
		return changed
	}
	
	async NewDirect(userID: string, memberID: string): Promise<string> {
		if (userID === memberID)
			return ""
		
		var user = await this.GetOrAddUser(userID)
		if (user.FriedsWithDirect.includes(memberID))
			return ""
		
		const room = await this.chatRoomRepo.save(this.chatRoomRepo.create({
			OwnerID:"", Name:"", HasPassword: false, RoomType: +ChatRoomType.Private,
			MemberIDs:[userID, memberID], AdminIDs:[],
			BanIDs:[], MuteIDs:[], MuteDates:[],
			MessageGroupDepth: 0, MessageCount: 0, Direct: true
		}))
		
		user.DirectChatsIn.push(room.ID)
		user.FriedsWithDirect.push(memberID)
		
		await Promise.all([
			this.chatUserRepo.save(user),
			this.ModifyUser(memberID, async user => {
				user.DirectChatsIn.push(room.ID)
				user.FriedsWithDirect.push(userID)
				return true
			}),
		])
		
		this.Notify(`user-${memberID}`, "room")
		
		return room.ID
	}
	
	async NewRoom(roomDTO: ChatRoomDTO, userID: string): Promise<string> {
		
		const { OwnerID, Name, Password, RoomType } =  roomDTO
		
		if (OwnerID !== userID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		const room = await this.chatRoomRepo.save(this.chatRoomRepo.create({
			OwnerID, Name, HasPassword: Password !== "", RoomType: +ChatRoomType[RoomType],
			MemberIDs:[OwnerID], AdminIDs:[OwnerID],
			BanIDs:[], MuteIDs:[], MuteDates:[],
			MessageGroupDepth: 0, MessageCount: 0, Direct: false
		}))
		
		await Promise.all([
			this.chatRoomPassRepo.save(this.chatRoomPassRepo.create({
				ID: room.ID, Password: await bcrypt.hash(Password, 10)
			})),
			this.ModifyUser(OwnerID, async user => {
				user.ChatRoomsIn.push(room.ID)
				return true
			}),
		])
		
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
		await Promise.all([
			this.chatRoomRepo.save(room),
			this.chatMessageRepo.save(msgGroup),
		])
		
		this.Notify("room-" + roomID, ChatMessageDTO.toString())
		return ""
	}
	
	async AddUserToRoom(roomID: string, userID: string, password: string, memberID: string = ""): Promise<string> {
		const [room, changed] = await this.ModifyRoom(roomID, async room => {
			if (room.HasPassword)
				if (!room.AdminIDs.includes(memberID) && !await bcrypt.compare(password, (await this.chatRoomPassRepo.findOneBy({ID: roomID})).Password))
					throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			if (room.BanIDs.includes(userID) || room.MemberIDs.includes(userID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			room.MemberIDs.push(userID)
			await this.ModifyUser(userID, async user => {
				user.ChatRoomsIn.push(roomID)
				return true
			})
			return true
		})
		this.Notify(`room-${roomID}`, "mem")
		this.Notify(`user-${userID}`, "room")
		return roomID
	}
	
	async GetPublicRooms(): Promise<ChatRoomPreview[]> {
		return this.chatRoomRepo.findBy({RoomType: +ChatRoomType.Public})
			.then(rooms => rooms.map(
				room => new ChatRoomPreview(room.ID, room.Name, room.HasPassword, room.BanIDs)))
	}
	
	async GetRoom(roomID: string): Promise<ChatRoom>
		{ return this.chatRoomRepo.findOneBy({ ID: roomID }) }
	
	async ModifyRoom(roomID: string, func: (ChatUser: ChatRoom) => Promise<boolean>, room: ChatRoom | null = null): Promise<[ChatRoom, boolean]> {
		room ??= await this.GetRoom(roomID)
		var changed = await func(room)
		if (changed)
			room = await this.chatRoomRepo.save(room)
		return [room, changed]
	}
	
	async GetOrAddUser(userID: string): Promise<ChatUser> {
		var user = await this.chatUserRepo.findOneBy({ ID: userID })
		if (!!user)
			return user
		return await this.chatUserRepo.save(this.chatUserRepo.create({
			ID: userID, ChatRoomsIn:[], DirectChatsIn:[], FriedsWithDirect:[], BlockedUserIDs:[]
		}))
	}
	
	async ModifyUser(ID: string, func: (ChatUser: ChatUser) => Promise<boolean>, user: ChatUser | null = null): Promise<[ChatUser, boolean]> {
		user ??= await this.GetOrAddUser(ID)
		const changed = await func(user)
		if (changed)
			user = await this.chatUserRepo.save(user)
		return [user, changed]
	}
	
	async MakeAdmin(roomID: string, memberID: string, userID: string): Promise<boolean> {
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
		return changed
	}
	
	async RemoveAdmin(roomID: string, memberID: string, ownerID: string): Promise<boolean> {
		const [_, changed] = await this.ModifyRoom(roomID, async room => {
			if (room.OwnerID !== ownerID || room.OwnerID === memberID)
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			var index = room.AdminIDs.indexOf(memberID);
			if (index === -1)
				return false
			room.AdminIDs.splice(index, 1);
			return true
		})
		if (changed)
			this.Notify(`room-${roomID}`, "mem")
		return changed
	}
	
	async RemoveMember(roomID: string, memberID: string, ban: boolean = false, adminID: string | null, selfID: string): Promise<boolean> {
		const [_, changed] = await this.ModifyRoom(roomID, async room => {
			if (!!adminID && !room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			if (room.OwnerID === memberID
				|| (room.AdminIDs.includes(memberID) && memberID !== selfID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
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
		return changed
	}
	
	async DeleteRoom(ownerID: string, roomID: string) {
		const room = await this.GetRoom(roomID);
		if (ownerID !== room.OwnerID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		for (const memberID of room.MemberIDs) {
			this.ModifyUser(memberID, async user => {
				const index = user.ChatRoomsIn.indexOf(roomID);
				if (index === -1)
					return false
				user.ChatRoomsIn.splice(index, 1)
				this.Notify(`user-${memberID}`, "kick")
				return true
			})
		}
		
		for (let index = 1; index <= room.MessageGroupDepth; index++)
			this._getMsgID(roomID, index, room)
				.then(ID => this.chatMessageRepo.delete({ID}))
		
		this.chatRoomPassRepo.delete({ID: roomID})
		
		await this.chatRoomRepo.remove(room);
	}
	
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
