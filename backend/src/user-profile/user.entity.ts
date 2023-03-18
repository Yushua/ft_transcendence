import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatProfile } from "./user.stat.entity";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    intraName: string;

    @Column({ default: ""})
    username: string;

    //string path towards the picture
    @Column({ default: ""})
    profilePicture: string

    //check if the email unique "" default is not hampering more than one account
    @Column({
        unique: true,
        default: ""
    })
    eMail: string;

    @Column("text", { array: true , default: "{}"})
    friendList: string[];

    @OneToMany((_type) => StatProfile, stat => stat.user, { eager: true})
    stat: StatProfile[];
}
