import { UserStatus } from "./user-profile-status.model";
import { FriendsProfile } from "./user.entity.friends";
import { StatProfile } from "./user.stat.entity";
export declare class UserProfile {
    id: string;
    username: string;
    password: string;
    eMail: string;
    status: UserStatus;
    friendsProfile: FriendsProfile;
    statProfile: StatProfile[];
}
