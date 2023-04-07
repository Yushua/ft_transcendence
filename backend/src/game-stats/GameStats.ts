import { UserProfile } from "src/user-profile/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameStats{
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @Column({default: 0})
    scoreWinner: number
    @Column({default: 0})
    scoreLoser: number
    @Column({default: 0})
    timeOfGame: number

    @ManyToOne((_type) => UserProfile, (UserProfile) => UserProfile.GameStats, {})
    UserProfile : UserProfile[];
}

