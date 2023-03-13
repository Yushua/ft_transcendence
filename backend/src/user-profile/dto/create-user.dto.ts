import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";
import { UserStatus } from "../user-profile-status.model";

export class CreateUserDto {
    @Column({
        unique: true
    })
    username: string;

    @Column({
        unique: true
    })
    eMail: string;

    // @Column()
    // friendlist: Array<string>;

    status: UserStatus
}
