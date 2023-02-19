import { Repository } from 'typeorm';
import { userProfileCredentialsDto } from './dto/user-profile-credentials.dto';
import { UserProfile } from './user-profile.entity';
import { UserStatus } from './user-status.module';
export declare class UserProfileService {
    private readonly userProfileEntity;
    constructor(userProfileEntity: Repository<UserProfile>);
    findUserById(id: string): Promise<UserProfile>;
    injectUser(userProfileCredentialsDto: userProfileCredentialsDto): Promise<UserProfile>;
    findUserProfileById(id: string): Promise<UserProfile>;
    getAll(): Promise<UserProfile[]>;
    updateStatus(id: string, status: UserStatus): Promise<UserProfile>;
}
