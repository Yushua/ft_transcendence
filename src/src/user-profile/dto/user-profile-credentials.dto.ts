import { IsNotEmpty } from "class-validator";
import { UserStatus } from "../user-status.module";

export class userProfileCredentialsDto {
    @IsNotEmpty()
    username: string;   

}
