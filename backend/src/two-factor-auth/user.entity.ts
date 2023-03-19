import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserTwoFactor {
    @PrimaryGeneratedColumn('uuid')
    random: string;

    @Column()
    id: string;

    @Column({ default: false})
    twoFactor: boolean

    @Column({ default: ""})
    secretCode: string
}
