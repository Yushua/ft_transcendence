
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user.entity";

@Entity()
export class StatProfile {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    gameName: string;
    // @Column()
    // wins: Int32List;
    // @Column()
    // losses: Int32List;
    
    @ManyToOne((_type) => UserProfile, user => user.stat, { eager: false})
    user: UserProfile[];
}

/*
what i could do is makine a template, where games can send their things ot it.
then, i search through it by name, and get the info from there
*/