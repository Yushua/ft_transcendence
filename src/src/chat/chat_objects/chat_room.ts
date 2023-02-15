import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ChatMessage } from "./chat_message";

export enum ChatRoomType {
	Public,
	Private
}

@Entity()
export class ChatRoom {
	@PrimaryGeneratedColumn('uuid')  ID:                string
	@Column()                        OwnerID:           string
	@Column("text", { array: true }) MemberIDs:         string[]
	@Column("text", { array: true }) AdminIDs:          string[]
	@Column()                        Password:          string
	@Column()                        RoomType:          ChatRoomType
	@Column("text", { array: true }) BlackList:         string[]
	@Column()                        MessageGroupDepth: number
}
