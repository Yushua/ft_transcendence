import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user.entity";

@Entity()
export class UserAchievement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: ""})
    nameAchievement: string;

    @Column({ default: ""})
    pictureLink: string;

    @Column({ default: ""})
    message: string;

    // @ManyToOne(() => UserProfile, userProfile => userProfile.userAchievements)
    // userProfile: UserProfile;

    @ManyToMany(
        () => UserProfile,
        user => user.userAchievements,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
      )
      userProfiles?: UserProfile[];
}
