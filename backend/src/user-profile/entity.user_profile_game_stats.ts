import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { GameStats } from '../pong/pong.entity.gamestats'
import { UserProfile } from "./user.entity";


@Entity('user_profile_game_stats')
export class UserProfileGameStats {
  @PrimaryColumn({ name: 'user_profile_id' })
  userId: string;

  @PrimaryColumn({ name: 'game_stats_id' })
  gameId: string;

  @ManyToOne(
    () => UserProfile,
    user => user.userStats,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'user_profile_id', referencedColumnName: 'id' }])
  users: UserProfile[];

  @ManyToOne(
    () => GameStats,
    game => game.userProfiles,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'game_stats_id', referencedColumnName: 'id' }])
  games: GameStats[];
}
