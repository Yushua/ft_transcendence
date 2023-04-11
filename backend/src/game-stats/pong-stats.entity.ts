import { UserProfile } from "src/user-profile/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PongStats{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default:"default_pfp.jpg"})
    picture:string
    @Column({default:""})
    player1_id:string
    @Column({default:""})
    player2_id:string

    @Column({default:""})
    nameGame: string
    @Column({default:""})
    winner:string
    @Column({default:""})
    loser:string

    @Column({default: 11})
    scoreWinner: number
    @Column({default: 0})
    scoreLoser: number
    @Column({default: 0})
    timeOfGame: number

    @ManyToMany(
        () => UserProfile,
        user => user.userStats,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
      )
      userProfiles?: UserProfile[];
}

