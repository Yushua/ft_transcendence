import { UserProfile } from "src/user-profile/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: ""})
    name: string;

    @Column({ default: ""})
    pictureLink: string;

    @Column({ default: ""})
    message: string;

    @ManyToMany(
        () => UserProfile,
        user => user.userAchievements,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
      )
      userProfiles?: UserProfile[];
}
