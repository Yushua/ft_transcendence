import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

export enum PongRoomType {
	Public,
	Private
}

export enum GameType {
	Pong_classic,
	Pong_extra,
}

@Entity()
export class PongRoom {
	@PrimaryGeneratedColumn('uuid')		id:			string
	@Column("text", { array: true })	PlayerIDs:	string[]
	@Column()							GameName:	string
	// @Column("text", { array: true }) WatcherIDs:	string[]
	@Column()							GameType:	GameType
	@Column()                       	RoomType:	PongRoomType
}
