import { Column, Entity } from "typeorm";

@Entity()
export class UserTwoFactor {
    @Column()
    id: string;

    @Column({ default: false})
    twoFactor: boolean

    @Column({ default: ""})
    secretCode: string
}
