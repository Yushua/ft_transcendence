import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAchievement } from "./userAchievement.entity";

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
    
    @Column({ default: false})
    TWTStatus: boolean

    @Column({ default: ""})
    QRSecret: string

    @Column("text", { array: true , default: "{}"})
    friendList: string[];

    @Column({ default: 0})
    wins: number;

    @Column({ default: 0})
    losses: number;

    @OneToMany(() => UserAchievement, UserAchievement => UserAchievement.userProfile)
    UserAchievement : UserAchievement[];
}
