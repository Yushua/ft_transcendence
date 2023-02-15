import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { ChatRoomType } from "../chat_objects/chat_room"

export class ChatRoomDTO {
	@IsNotEmpty()
	@IsString()
	OwnerID: string
	
	@IsString()
	Password: string
	
	@IsNotEmpty()
	@IsEnum(ChatRoomType)
	RoomType: ChatRoomType
}
