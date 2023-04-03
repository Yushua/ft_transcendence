import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user.entity";

@Entity()
export class UserStat{
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @ManyToOne(() => UserProfile, userProfile => userProfile.UserStat)
    userProfile: UserProfile;
}
