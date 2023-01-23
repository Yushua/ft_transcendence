import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "./user-status.module";

@Entity()
export class UserProfile {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;
    
    @Column()
    status: UserStatus;
}