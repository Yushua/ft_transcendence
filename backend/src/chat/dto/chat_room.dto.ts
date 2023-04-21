import { IsBoolean, IsEnum, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator"
import { ChatRoomType } from "../chat_entities/chat_room"

export class ChatRoomDTO {
	@IsNotEmpty()
	@IsString()
	OwnerID: string
	
	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	Name: string
	
	@IsString()
	@Matches(/t|f/)
	HasPassword: string
	
	@IsString()
	Password: string
	
	@IsNotEmpty()
	@IsEnum(ChatRoomType)
	RoomType: ChatRoomType
}
