import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "./user-profile-status.model";
import { FriendsProfile } from "./user.entity.friends";
import { StatProfile } from "./user.stat.entity";

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

    @OneToMany((_type) => StatProfile, stat => stat.user, { eager: true})
    stat: StatProfile[];
}
