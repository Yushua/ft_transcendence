
import { Column } from "typeorm";

export class CreateUserDto {
    @Column({
        unique: true
    })
    username: string;

    @Column({
        unique: true
    })
    eMail: string;
}
