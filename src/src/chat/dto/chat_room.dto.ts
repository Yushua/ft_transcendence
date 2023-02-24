import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { ChatRoomType } from "../chat_entities/chat_room"

export class ChatRoomDTO {
	@IsNotEmpty()
	@IsString()
	OwnerID: string
	
	@IsString()
	@IsNotEmpty()
	Name: string
	
	@IsString()
	Password: string
	
	@IsNotEmpty()
	@IsEnum(ChatRoomType)
	RoomType: ChatRoomType
}
