import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user.entity";

@Entity()
export class UserAchievement {
    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    timeSet: number;

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

    @CreateDateColumn()
    createdAt: number;

    @ManyToOne((_type) => UserProfile, (userProfile) => userProfile.UserAchievement, {eager: false})
    userProfile: UserProfile;
}
