import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChatMessageDTO {
	
	@IsNotEmpty()
	public OwnerID: string;
	
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	public Message: string;
}
