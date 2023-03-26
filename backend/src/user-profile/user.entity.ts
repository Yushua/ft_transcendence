import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column("text", { array: true , default: "{}"})
    friendList: string[];

    @Column("text", { array: true , default: "{}"})
    AchievementList: string[];

    @Column({ default: 0})
    wins: number;

    @Column({ default: 0})
    losses: number;

    @Column("text", { array: true , default: []})
    achievements: string[][];
}
