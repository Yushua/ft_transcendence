import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { GameRoomType } from "../components/game_room"

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
	@IsEnum(GameRoomType)
	RoomType: GameRoomType
}
