import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserStat } from "./user.Stat";
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
    @Column({ default: "default_pfp.jpg"})
    profilePicture: string
    
    @Column({ default: "Creation"})
    userStatus: string

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

    @OneToMany(() => UserStat, UserStat => UserStat.userProfile)
    UserStat : UserStat[];
}
