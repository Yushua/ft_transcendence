import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FriendsProfile {
    @PrimaryGeneratedColumn()
    name: string;
}
