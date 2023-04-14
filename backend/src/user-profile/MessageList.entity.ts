import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user.entity";

@Entity()
export class MessageList {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: ""})
    userID: string;

    @Column({default: ""})
    status: string;

    @Column({default: ""})
    message: string;
    
    @Column({default: 0})
    timeStamp: number;

    @ManyToOne((_type) => UserProfile, (userProfile) => userProfile.MessageList, {eager: false})
    userProfile: UserProfile;
}
