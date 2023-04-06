import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Achievement } from "src/achievements/achievements.entity";
import { PongStats } from "src/game-stats/pong-stats.entity";
@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /* USER INFO */
    @Column({unique: true})
    intraName: string;

    @Column({default: ""})
    username: string;

    @Column({default: "default_pfp.jpg"}) /* string path towards the picture */
    profilePicture: string
    
    @Column({default: "Creation"})
    userStatus: string

    @Column({default: false})
    TWTStatus: boolean

    @Column({default: ""})
    QRSecret: string

    @Column("text", {array: true , default: "{}"})
    friendList: string[];


    /* GAME STATS  */
    @Column({default: 0})
    experience: number;

    @Column({default: 0})
    wins: number;

    @Column({default: 0})
    losses: number;

    @Column({default: 0})
    pong_experience: number;

    @Column({default: 0})
    pong_wins: number;

    @Column({default: 0})
    pong_losses: number;

    /* RELATIONS */
    @ManyToMany(
        () => PongStats, 
        pongStats => pongStats.userProfiles, //optional
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
        @JoinTable({
          name: 'user_profile_game_stats',
          joinColumn: {
            name: 'user_profile_id',
            referencedColumnName: 'id',
          },
          inverseJoinColumn: {
            name: 'game_stats_id',
            referencedColumnName: 'id',
          },
        })
        userStats?: PongStats[];

    @ManyToMany(
      () => Achievement, 
      userAchievements => userAchievements.userProfiles, //optional
      {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
      @JoinTable({
        name: 'user_profile_achievements',
        joinColumn: {
          name: 'user_profile_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'achievement_id',
          referencedColumnName: 'id',
        },
      })
      userAchievements?: Achievement[];
  
      
}
