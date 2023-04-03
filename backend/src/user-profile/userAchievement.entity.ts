import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user.entity";

@Entity()
export class UserAchievement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nameAchievement: string;

    @Column()
    pictureLink: string;

    @Column()
    message: string;

    @ManyToOne(() => UserProfile, userProfile => userProfile.UserAchievement)
    userProfile: UserProfile;
}
