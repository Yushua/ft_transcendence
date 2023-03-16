import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FriendsProfile {
    @PrimaryGeneratedColumn()
    name: string;
}
