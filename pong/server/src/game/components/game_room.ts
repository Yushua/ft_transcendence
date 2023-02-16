import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

export enum GameRoomType {
	Public,
	Private
}

export enum GameType {
	Pong_classic,
	Pong_extra,
	Tic_tac_toe
}

@Entity()
export class GameRoom {
	@PrimaryGeneratedColumn('uuid')		ID:			string
	@Column("text", { array: true })	PlayerIDs:	string[]
	@Column()							GameName:	string
	// @Column("text", { array: true }) WatcherIDs:	string[]
	@Column()							GameType:	GameType
	@Column()                       	RoomType:	GameRoomType
}
