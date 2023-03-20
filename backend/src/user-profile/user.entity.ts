import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    intraName: string;

    @Column({ default: ""})
    username: string;

    //string path towards the picture
    @Column({ default: ""})
    profilePicture: string

    @Column({ default: false})
    twoFactor: boolean

    //check if the email unique "" default is not hampering more than one account
    @Column({
        unique: true,
        default: ""
    })
    eMail: string;

    @Column("text", { array: true , default: "{}"})
    friendList: string[];
}
