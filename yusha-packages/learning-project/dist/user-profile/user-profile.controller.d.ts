import { UpdateStatusDto } from './dto/updata-status.dto';
import { userProfileCredentialsDto } from './dto/user-profile-credentials.dto';
import { UserProfile } from './user-profile.entity';
import { UserProfileService } from './user-profile.service';
export declare class UserProfileController {
    private userProfileService;
    constructor(userProfileService: UserProfileService);
    postUserProfile(userProfileCredentialsDto: userProfileCredentialsDto): Promise<UserProfile>;
    getOfflineGive(id: string, updateStatusDto: UpdateStatusDto): Promise<UserProfile>;
    getOffline(id: string): Promise<UserProfile>;
    getOnline(id: string): Promise<UserProfile>;
    getUserProfileById(id: string): Promise<UserProfile>;
    getAllUseProfile(): Promise<UserProfile[]>;
}
