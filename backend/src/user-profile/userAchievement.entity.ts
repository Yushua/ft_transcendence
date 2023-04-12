import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { UserProfile } from "./user.entity";

@Entity()
export class UserAchievement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @CreateDateColumn({ type: 'bigint' })
    createdAt: number;

    @ManyToOne((_type) => UserProfile, (userProfile) => userProfile.UserAchievement, {eager: false})
    userProfile: UserProfile;
}
