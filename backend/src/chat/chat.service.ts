import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
import { AddAchievement } from 'src/user-profile/dto/addAchievement.dto';
import { UserProfileService } from 'src/user-profile/user-profile.service';

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
			private readonly userProfileRepo: Repository<UserProfile>, // Used only in DEBGU
	) {}
	
	//#region Utils
	private async _modifyRoom(
			roomID: string, 
			func: (ChatUser: ChatRoom) => Promise<boolean>, 
			room: ChatRoom | null = null)
		: Promise<[ChatRoom, boolean]>
	{
		room ??= await this.chatRoomRepo.findOneBy({ID: roomID})
		var changed = await func(room)
		if (changed)
			room = await this.chatRoomRepo.save(room)
		return [room, changed]
	}
	
	private async _modifyUser(
			ID: string, 
			func: (ChatUser: ChatUser) => Promise<boolean>, 
			user: ChatUser | null = null)
		: Promise<[ChatUser, boolean]>
	{
		user ??= await this.GetOrAddUser(ID)
		const changed = await func(user)
		if (changed)
			user = await this.chatUserRepo.save(user)
		return [user, changed]
	}
	
	private _getMsgID(
			roomID: string, 
			index: number, 
			room: ChatRoom)
		: string
	{
		if (index < 0)
			index = room.MessageGroupDepth + index + 1
		return `${roomID}__${index}`
	}
	
	private async _addMessageGroup(roomID: string): Promise<ChatMessageGroupManager>{
		return this.chatMessageRepo.save(this.chatMessageRepo.create({
			ID:           roomID,
			OwnerIDs:     [],
			Messages:     [],
			MessageCount: 0
		}))
	}
	
	private async _addMemberToRoom(
		roomID: string,
		userID: string,
		password: string,
		memberID: string = "")
	: Promise<string>
	{
		const [room, changed] = await this._modifyRoom(roomID, async room => {
			/* Adding friend */
			if (room.MemberIDs.includes(memberID)) {
				const user = await this.userProfileRepo.findOneBy({id: userID});
				if (!user.friendList.includes(memberID))
					throw new HttpException("You can only add people that friend you back.", HttpStatus.UNAUTHORIZED)
			}
			/* Joining with password */
			else if (room.HasPassword)
				if (!await bcrypt.compare(password, (await this.chatRoomPassRepo.findOneBy({ID: roomID})).Password))
					throw new HttpException("Incorrect password.", HttpStatus.UNAUTHORIZED)
			
			if (room.BanIDs.includes(userID))
				throw new HttpException("This user is banned from this room.", HttpStatus.UNAUTHORIZED)
			if (room.MemberIDs.includes(userID))
				false
			
			room.MemberIDs.push(userID)
			await this._modifyUser(userID, async user => {
				user.ChatRoomsIn.push(roomID)
				return true
			})
			return true
		})
		if (changed) {
			this.Notify(`room-${roomID}`, "mem")
			this.Notify(`user-${userID}`, "room")
			
			if (room.MemberIDs.length !== 10)
				return
			let AddAchievement:AddAchievement = {
				nameAchievement: "Busy Admin",
				pictureLink: "./public/invalid_cross.jpg",
				message: "You managed a chat room of 10 or more people, wow..."
			}
			for (const adminID of room.AdminIDs)
				UserProfileService.GetInstance()?.postAchievementList(adminID, AddAchievement)
		}
		return roomID
	}
	
	private async _removeMember(
			roomID: string, 
			memberID: string, 
			ban: boolean = false, 
			adminID: string | null, 
			selfID: string)
		: Promise<boolean>
	{
		const [_, changed] = await this._modifyRoom(roomID, async room => {
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
			
			await this._modifyUser(memberID, async user => {
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
			this.Notify(`user-${memberID}`, `kick${roomID}`)
		}
		return changed
	}
	
	private async _postMessageToRoom(room: ChatRoom, msg: ChatMessage) {
		room.MessageCount += 1
		var depth = room.MessageGroupDepth
		var msgGroup = await this.chatMessageRepo.findOneBy({ ID: this._getMsgID(room.ID, depth, room) })
		if (!msgGroup || !msgGroup.AddMessage(msg)) {
			depth = (room.MessageGroupDepth += 1)
			msgGroup = await this._addMessageGroup(this._getMsgID(room.ID, depth, room))
			msgGroup.AddMessage(msg)
		}
		
		await Promise.all([
			this.chatRoomRepo.save(room),
			this.chatMessageRepo.save(msgGroup),
		])
		this.Notify("room-" + room.ID, "msg")
	}
	//#endregion
	
	//#region Owner Commands
	async EditRoom(
			roomID: string, 
			roomDTO: ChatRoomDTO, 
			ownerID: string)
		: Promise<void>
	{
		const { OwnerID, Name, HasPassword, Password, RoomType } =  roomDTO
		
		if (OwnerID !== ownerID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		const [room, changed] = await this._modifyRoom(roomID, async room => {
			if (room.OwnerID !== ownerID)
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			room.Name = Name
			room.RoomType = +ChatRoomType[RoomType]
			
			if (HasPassword === 'f')
				return true
			room.HasPassword = Password !== ""
			
			const rPass = await this.chatRoomPassRepo.findOneBy({ID: roomID})
			rPass.Password = room.HasPassword ? await bcrypt.hash(Password, 10) : "";
			await this.chatRoomPassRepo.save(rPass)
			
			return true
		})
		if (!changed)
			return
		for (const userID of room.MemberIDs)
			this.Notify(`user-${userID}`, "room")
		this.Notify(`room-${roomID}`, "room")
	}
	
	async RemoveAdmin(
			roomID: string, 
			memberID: string, 
			ownerID: string)
		: Promise<boolean>
	{
		const [_, changed] = await this._modifyRoom(roomID, async room => {
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
	
	async DeleteRoom(ownerID: string, roomID: string, clearMembers: boolean = true) {
		const room = await this.GetRoom(roomID, ownerID);
		if (room.OwnerID !== "" && ownerID !== room.OwnerID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		if (clearMembers)
			for (const memberID of room.MemberIDs) {
				await this._modifyUser(memberID, async user => {
					const index = user.ChatRoomsIn.indexOf(roomID);
					if (index === -1)
						return false
					user.ChatRoomsIn.splice(index, 1)
					return true
				})
				this.Notify(`user-${memberID}`, `kick${roomID}`)
			}
		
		for (let index = 1; index <= room.MessageGroupDepth; index++)
			this.chatMessageRepo.delete({ID: this._getMsgID(roomID, index, room)})
		
		this.chatRoomPassRepo.delete({ID: roomID})
		
		await this.chatRoomRepo.remove(room);
	}
	//#endregion
	
	//#region Admin Commands
	Kick = (roomID: string, memberID: string, adminID: string)
		: Promise<boolean> => this._removeMember(roomID, memberID, false, adminID, "")
	
	Ban = (roomID: string, memberID: string, adminID: string)
		: Promise<boolean> => this._removeMember(roomID, memberID, true, adminID, "")
	
	async MakeAdmin(
			roomID: string, 
			memberID: string, 
			userID: string)
		: Promise<boolean>
	{
		const [room, changed] = await this._modifyRoom(roomID, async room => {
			if (!room.AdminIDs.includes(userID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)
			
			if (room.AdminIDs.includes(memberID) || !room.MemberIDs.includes(memberID))
				return false
			
			room.AdminIDs.push(memberID)
			return true
		})
		if (changed) {
			this.Notify("room-" + roomID, "mem")
			
			if (room.MemberIDs.length < 10)
				return
			let AddAchievement:AddAchievement = {
				nameAchievement: "Busy Admin",
				pictureLink: "./public/invalid_cross.jpg",
				message: "You managed a chat room of 10 or more people, wow..."
			}
			UserProfileService.GetInstance()?.postAchievementList(memberID, AddAchievement)
		}
		return changed
	}
	
	async UnBan(
			roomID: string, 
			userID: string, 
			adminID: string)
		: Promise<boolean>
	{
		const [_, changed] = await this._modifyRoom(roomID, async (room) => {
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
	
	async Mute(
			roomID: string, 
			userID: string, 
			time: number, 
			adminID: string)
		: Promise<boolean>
	{
		if (!Number.isInteger(time))
			throw new HttpException(`"${time}" is not an integer`, HttpStatus.BAD_REQUEST)
		if (time > 7 * 1000 * 60 * 60 * 24)
			throw new HttpException(`Can't mute someone for longer then a week!`, HttpStatus.BAD_REQUEST)
		if (time < 0)
			throw new HttpException(`Can't mute someone for negative time!`, HttpStatus.BAD_REQUEST)
		
		const [_, changed] = await this._modifyRoom(roomID, async (room) => {
			if (!room.AdminIDs.includes(adminID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)

			if (room.OwnerID === userID
				|| room.AdminIDs.includes(userID))
				throw new HttpException("", HttpStatus.UNAUTHORIZED)

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
		const [_, changed] = await this._modifyRoom(roomID, async (room) => {
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
	//#endregion
	
	//#region Member Commands
	Leave = (roomID: string, selfID: string)
		: Promise<boolean> => this._removeMember(roomID, selfID, false, null, selfID)
	
	AddFriend = (roomID: string, friendID: string, selfID: string)
		: Promise<string> => this._addMemberToRoom(roomID, friendID, "", selfID)
	
	async GetRoom(roomID: string, userID: string): Promise<ChatRoom> {
		const room = await this.chatRoomRepo.findOneBy({ ID: roomID })
		if (!room.MemberIDs.includes(userID))
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		return room
	}
	
	async GetMessages(
			roomID: string, 
			index: number, 
			userID: string)
		: Promise<ChatMessage[]>
	{
		if (!Number.isInteger(index))
			throw `${index} is not an integer`;
		
		const room = await this.GetRoom(roomID, userID);
		if (!room.MemberIDs.includes(userID))
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		return (await this.chatMessageRepo.findOneBy({ ID: this._getMsgID(roomID, index, room) }))
			?.ToMessages()
			?? []
	}
	
	async PostNewMessage(
			roomID: string, 
			msgDTO: ChatMessageDTO, 
			userID: string)
		: Promise<string>
	{
		const { OwnerID, Message } = msgDTO
		if (OwnerID !== userID)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		const msg = new ChatMessage(OwnerID, Message)
		
		/* Check for mute */
		const room = await this.GetRoom(roomID, userID)
		const index = room.MuteIDs.indexOf(OwnerID)
		if (index !== -1) {
			const date = room.MuteDates[index]
			if (+date > Date.now())
				return date
			room.MuteIDs.splice(index, 1)
			room.MuteDates.splice(index, 1)
		}
		
		/* Add Message */
		await this._postMessageToRoom(room, msg)
		return ""
	}
	
	async InviteFriendToGame(userID: string, friendID: string, body: any) {
		const id = body?.id
		if (!id || typeof(id) !== 'string' || id === "" || id.length > 20)
			throw new HttpException("", HttpStatus.BAD_REQUEST)
		
		const user = await this.GetOrAddUser(userID)
		const index = user.FriedsWithDirect.indexOf(friendID)
		if (index === -1)
			throw new HttpException("", HttpStatus.UNAUTHORIZED)
		
		const room = await this.GetRoom(user.DirectChatsIn[index], userID)
		await this._postMessageToRoom(room, new ChatMessage("game", id))
	}
	
	async BlockUser(userID: string, memberID: string) {
		var user = await this.GetOrAddUser(userID)
		var member = await this.GetOrAddUser(memberID)
		
		user.BlockedUserIDs.push(memberID)
		
		var index = user.FriedsWithDirect.indexOf(memberID)
		var roomID: string | null = null
		if (index !== -1) {
			roomID = user.DirectChatsIn[index]
			this.DeleteRoom(userID, roomID, false)
			user.FriedsWithDirect.splice(index, 1)
			user.DirectChatsIn.splice(index, 1)
			await this.chatUserRepo.save(user)
			
			index = member.FriedsWithDirect.indexOf(userID)
			member.FriedsWithDirect.splice(index, 1)
			member.DirectChatsIn.splice(index, 1)
			await this.chatUserRepo.save(member)
		}
		else
			await this.chatUserRepo.save(user)
		
		if (!!roomID) {
			this.Notify(`user-${userID}`, `kick${roomID}`)
			this.Notify(`user-${memberID}`, `kick${roomID}`)
		}
	}
	
	async UnblockUser(userID: string, memberID: string) {
		await this._modifyUser(userID, async user => {
			const index = user.BlockedUserIDs.indexOf(memberID)
			if (index === -1)
				return false
			user.BlockedUserIDs.splice(index, 1)
			return true
		})
	}
	//#endregion
	
	//#region Creation Commands
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
			this._modifyUser(OwnerID, async user => {
				user.ChatRoomsIn.push(room.ID)
				return true
			}),
		])
		
		return room.ID
	}
	
	async NewDirect(userID: string, memberID: string): Promise<string>{
		var user = await this.GetOrAddUser(userID)
		
		const existingRoomID = user.FriedsWithDirect.indexOf(memberID)
		if (existingRoomID !== -1)
			return user.DirectChatsIn[existingRoomID]
		
		if (user.BlockedUserIDs.includes(memberID))
			throw new HttpException("You have blocked this user.", HttpStatus.BAD_REQUEST)
		
		var member = await this.GetOrAddUser(memberID)
		if (member.BlockedUserIDs.includes(userID))
			throw new HttpException("This user has blocked you.", HttpStatus.UNAUTHORIZED)
		
		const index = member.FriedsWithDirect.indexOf(userID)
		if (index != -1) {
			user.DirectChatsIn.push(member.DirectChatsIn[index])
			user.FriedsWithDirect.push(memberID)
			await this.chatUserRepo.save(user)
			return
		}
		
		const room = await this.chatRoomRepo.save(this.chatRoomRepo.create({
			OwnerID:"", Name:"", HasPassword: false, RoomType: +ChatRoomType.Private,
			MemberIDs:[userID, memberID], AdminIDs:[],
			BanIDs:[], MuteIDs:[], MuteDates:[],
			MessageGroupDepth: 0, MessageCount: 0, Direct: true
		}))
		
		user.DirectChatsIn.push(room.ID)
		user.FriedsWithDirect.push(memberID)
		await this.chatUserRepo.save(user)
		
		member.DirectChatsIn.push(room.ID)
		member.FriedsWithDirect.push(userID)
		await this.chatUserRepo.save(member)
		
		this.Notify(`user-${memberID}`, "room")
		return room.ID
	}
	//#endregion
	
	//#region Outside Room Commands
	Join = (roomID: string, selfID: string, password: string)
		: Promise<string> => this._addMemberToRoom(roomID, selfID, password)	
	
	async GetOrAddUser(userID: string): Promise<ChatUser> {
		var user = await this.chatUserRepo.findOneBy({ ID: userID })
		if (!!user)
			return user
		return await this.chatUserRepo.save(this.chatUserRepo.create({
			ID: userID, ChatRoomsIn:[], DirectChatsIn:[], FriedsWithDirect:[], BlockedUserIDs:[]
		}))
	}
	
	async GetPublicRooms(): Promise<ChatRoomPreview[]> {
		return this.chatRoomRepo.findBy({RoomType: +ChatRoomType.Public})
			.then(rooms => rooms.map(
				room => new ChatRoomPreview(room.ID, room.Name, room.HasPassword, room.BanIDs)))
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
}
