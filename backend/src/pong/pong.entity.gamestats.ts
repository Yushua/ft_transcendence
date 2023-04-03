import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "../user-profile/user.entity";

@Entity()
export class GameStats{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    player1_id:string
    @Column()
    player2_id:string

    @Column()
    nameGame: string
    @Column()
    winner:string
    @Column()
    loser:string

    @Column()
    scoreWinner: number
    @Column()
    scoreLoser: number
    @Column()
    timeOfGame: number

    @ManyToMany(
        () => UserProfile,
        user => user.userStats,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
      )
      userProfiles?: UserProfile[];
}


