import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";
import { UserStatus } from "../user-profile-status.model";

export class AddFriendListDto {
    @Column()
    @IsNotEmpty()
    userID: string;
    @IsNotEmpty()
    @Column()
    FriendID: string;
}
