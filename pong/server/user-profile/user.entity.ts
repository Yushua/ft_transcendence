import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "./user-profile-status.model";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    username: string;

    @Column()
    password: string;

    @Column({
        unique: true
    })
    eMail: string;

    @Column()
    status: UserStatus;
}
