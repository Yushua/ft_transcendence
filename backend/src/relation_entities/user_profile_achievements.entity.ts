import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserProfile } from "src/user-profile/user.entity"; 
import { Achievement } from "src/achievements/achievements.entity";


@Entity('user_profile_achievements')
export class UserProfileAchievements {
  @PrimaryColumn({ name: 'user_profile_id' })
  userId: string;

  @PrimaryColumn({ name: 'achievement_id' })
  achievementId: string;

  @ManyToOne(
    () => UserProfile,
    user => user.userStats,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'user_profile_id', referencedColumnName: 'id' }])
  users: UserProfile[];

  @ManyToOne(
    () => Achievement,
    achievement => achievement.userProfiles,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'achievement_id', referencedColumnName: 'id' }])
  achievements: Achievement[];
}
