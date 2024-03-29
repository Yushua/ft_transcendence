import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PongStats } from "src/game-stats/pong-stats.entity";
import { UserAchievement } from "./userAchievement.entity";
import { MessageList } from "./MessageList.entity";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: ""})
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

    @Column("text", {array: true , default: "{}"})
    otherfriendList: string[];

    /* GAME STATS  */
    @Column({default: 0})
    experience: number;

    @Column({default: 0})
    wins: number;

    @Column({default: 0})
    losses: number;

    @Column({default: 0})
    pong_wins: number;

    @Column({default: 0})
    pong_losses: number;

    @Column({default: 0})
    pong_experience: number;

    @OneToMany((_type) => UserAchievement, (UserAchievement) => UserAchievement.userProfile, { eager: true, cascade:true})
    UserAchievement : UserAchievement[];

    //stores the messages, real simple
    @OneToMany((_type) => MessageList, (MessageList) => MessageList.userProfile, { eager: true, cascade:true})
    MessageList : MessageList[];

    /* RELATIONS */
    @ManyToMany(
        () => PongStats, 
        pongStats => pongStats.userProfiles, //optional
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
        @JoinTable({
          name: 'user_profile_pong_stats',
          joinColumn: {
            name: 'user_profile_id',
            referencedColumnName: 'id',
          },
          inverseJoinColumn: {
            name: 'pong_stats_id',
            referencedColumnName: 'id',
          },
        })
        userStats?: PongStats[];
  
  /* for message list settings */

  @Column({default: true})
  YourAchievements: boolean

  @Column({default: true})
  YourMainMessages: boolean
  
  //you only want updates from these users
  @Column("text", {array: true , default: "{}"})
  CheckFrienddList: string[];
}
