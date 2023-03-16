import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class AddFriendListDto {
    @Column()
    @IsNotEmpty()
    userID: string;
    @IsNotEmpty()
    @Column()
    FriendID: string;
}
