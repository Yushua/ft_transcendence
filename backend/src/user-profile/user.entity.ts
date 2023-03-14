import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "./user-profile-status.model";
import { FriendsProfile } from "./user.entity.friends";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    username: string;

    //string path towards the picture
    @Column({ default: ""})
    profilePicture: string

    @Column()
    password: string;

    @Column({
        unique: true
    })
    eMail: string;

    @Column()
    status: UserStatus;

    @Column("text", { array: true , default: "{}"})
    friendList: string[];

    @Column()
    wins: number;

    @Column()
    losses: number;
}
