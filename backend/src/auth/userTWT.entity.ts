import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserTWT {
    @PrimaryGeneratedColumn('uuid')
    random: string;

    @Column({ default: ""})
    id: string

    @Column({ default: false})
    TWT: boolean

    @Column({ default: ""})
    secretcode: string
}
