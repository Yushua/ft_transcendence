import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAchievement } from "./userAchievement.entity";
import { GameStats } from '../pong/pong.entity.gamestats'

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: ""})
    intraName: string;

    @Column({ default: ""})
    username: string;

    //string path towards the picture
    @Column({ default: "default_pfp.jpg"})
    profilePicture: string
    
    @Column({ default: "Creation"})
    userStatus: string

    @Column({ default: false})
    TWTStatus: boolean

    @Column({ default: ""})
    QRSecret: string

    @Column("text", { array: true , default: "{}"})
    friendList: string[];

    @Column({ default: 0})
    wins: number;

    @Column({ default: 0})
    losses: number;

    @OneToMany((_type) => UserAchievement, (UserAchievement) => UserAchievement.userProfile, { eager: true, cascade:true})
    UserAchievement : UserAchievement[];

    @ManyToMany(
        () => GameStats, 
        gameStats => gameStats.userProfiles, //optional
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
        userStats?: GameStats[];
      
}
