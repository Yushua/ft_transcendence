import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { PongRoomType } from "../components/pong_room"

export class GameRoomDTO {
	@IsNotEmpty()
	@IsString()
	PlayerIDs: string[]
	
	@IsNotEmpty()
	@IsString()
	GameName: string

	@IsNotEmpty()
	@IsNumber()
	GameType: number

	@IsNotEmpty()
	@IsEnum(PongRoomType)
	RoomType: PongRoomType
}
