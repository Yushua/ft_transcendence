import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class UsernameDTO {
    @IsString()
	@IsNotEmpty()
	@MinLength(5)
	@MaxLength(10)
    username: string;
}
