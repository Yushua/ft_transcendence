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

    @Column({
        unique: true,
    })
    username: string;

    //string path towards the picture
    @Column({ default: ""})
    profilePicture: string

    @Column()
    password: string;

    @Column()
    eMail: string;

    @Column("text", { array: true , default: "{}"})
    friendList: string[];

    @OneToMany((_type) => StatProfile, stat => stat.user, { eager: true})
    stat: StatProfile[];
}
