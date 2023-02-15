import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ChatMessageGroupManager {
	
	@PrimaryColumn({ unique: true }) ID:           string
	@Column()                        MessageCount: number
	@Column("text", { array: true }) OwnerIDs:     string[]
	@Column("text", { array: true }) Messages:     string[]
	
	GetMessage(index: number): ChatMessage {
		if (!Number.isInteger(index))
			throw `Not an integer: ${index}`
		if (index < 0 || index >= this.MessageCount)
			throw `Out of bounds: ${index} isn't within 0 and ${this.MessageCount}`
		return new ChatMessage(
			this.OwnerIDs[index],
			this.Messages[index]
		)
	}
	
	AddMessage(message: ChatMessage): boolean {
		if (this.MessageCount >= ChatMessageGroupManager.MaxMessageCount)
			return false
		this.OwnerIDs.push(message.OwnerID)
		this.Messages.push(message.Message)
		this.MessageCount += 1
		return true
	}
	
	ToMessages(): ChatMessage[] {
		const messages: ChatMessage[] = []
		for (let i = 0; i < this.MessageCount; i++)
			messages.push(new ChatMessage(
				this.OwnerIDs[i],
				this.Messages[i]
			))
		return messages
	}
	
	static readonly MaxMessageCount: number = 10
}

export class ChatMessage {
	constructor (
		public OwnerID: string,
		public Message: string
	) {}
}
