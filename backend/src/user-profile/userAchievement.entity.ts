import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user.entity";

@Entity()
export class UserAchievement {
    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    createdAt: number;

    @Column()
    nameAchievement: string;

    @Column()
    pictureLink: string;

    @Column({default: ""})
    extra: string;

    @Column()
    message: string;

    @Column()
    status: boolean;

    @ManyToOne((_type) => UserProfile, (userProfile) => userProfile.UserAchievement, {eager: false})
    userProfile: UserProfile;
}
