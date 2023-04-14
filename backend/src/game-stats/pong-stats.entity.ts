import { UserProfile } from "src/user-profile/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PongStats{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: "https://i.imgur.com/sZsuhQR.png"})
    pictureWin: string
   
    @Column({default: "https://i.imgur.com/DXLDXn2.png"})
    pictureLoss: string

    @Column({default:""})
    winner_id:string

    @Column({default:""})
    loser_id:string

    @Column({default:""})
    nameGame:string

    @Column({default:""})
    winner:string

    @Column({default:""})
    loser:string

    @Column({default: 11})
    scoreWinner:number

    @Column({default: 0})
    scoreLoser:number

    @Column({default: 0})
    timeOfGame:number

    @Column({default:""})
    timeStamp:string


    @ManyToMany(
        () => UserProfile,
        user => user.userStats,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
      )
      userProfiles?: UserProfile[];
}

