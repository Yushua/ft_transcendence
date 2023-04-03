import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserFriendlist{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @ManyToOne(() => UserProfile, userProfile => userProfile.UserFriendlist)
    // userProfile: UserProfile;
}
