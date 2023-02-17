import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "./user-profile-status.model";

@Entity()
export class FriendsProfile {
    @PrimaryGeneratedColumn()
    name: string;
}
