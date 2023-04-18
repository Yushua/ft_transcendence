import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class AddMessageDTO {
    @Column()
    @IsNotEmpty()
    status: string;
    @IsNotEmpty()
    @Column()
    message: string;
    @IsNotEmpty()
    @Column()
    userID: string;
}
