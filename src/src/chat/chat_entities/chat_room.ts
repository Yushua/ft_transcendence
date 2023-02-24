import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ChatMessage } from "./chat_message";

export enum ChatRoomType {
	Public,
	Private
}

@Entity()
export class ChatRoom {
	@PrimaryGeneratedColumn('uuid')  ID:                string
	@Column()                        OwnerID:           string
	@Column()                        Name:              string
	@Column()                        RoomType:          ChatRoomType
	@Column("text", { array: true }) MemberIDs:         string[]
	@Column("text", { array: true }) AdminIDs:          string[]
	@Column("text", { array: true }) BanIDs:            string[]
	@Column("text", { array: true }) MuteIDs:           string[]
	@Column("text", { array: true }) MuteDates:         string[]
	@Column()                        MessageGroupDepth: number
	@Column()                        Direct:            boolean
}

@Entity()
export class ChatRoomPassword {
	@PrimaryColumn({ unique: true }) ID:       string
	@Column()                        Password: string
}
