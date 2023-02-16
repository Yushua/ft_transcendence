import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { GameRoomType } from "../components/game_room"

export class ChatRoomDTO {
	@IsNotEmpty()
	@IsString()
	PlayerIDs: string[]
		
	@IsNotEmpty()
	@IsEnum(GameRoomType)
	RoomType: GameRoomType
}
