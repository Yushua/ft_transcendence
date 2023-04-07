import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserProfile } from "../user-profile/user.entity";
import { PongStats } from "src/game-stats/pong-stats.entity";


@Entity('user_profile_pong_stats')
export class UserProfilePongStats {
  @PrimaryColumn({ name: 'user_profile_id' })
  userId: string;

  @PrimaryColumn({ name: 'pong_stats_id' })
  pongStatsId: string;

  @ManyToOne(
    () => UserProfile,
    user => user.userStats,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'user_profile_id', referencedColumnName: 'id' }])
  users: UserProfile[];

  @ManyToOne(
    () => PongStats,
    game => game.userProfiles,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'pong_stats_id', referencedColumnName: 'id' }])
  games: PongStats[];
}
