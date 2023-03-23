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

    @Column()
    wins: number;

    @Column()
    losses: number;
}
