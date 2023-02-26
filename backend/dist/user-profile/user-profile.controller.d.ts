import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserStatus } from './user-profile-status.model';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';
export declare class UserProfileController {
    private userServices;
    constructor(userServices: UserProfileService);
    getAllTasks(filterDto: getTasksFilterDto): Promise<UserProfile[]>;
    getUserById(id: string): Promise<UserProfile>;
    getUsesListById(id: string): Promise<string[]>;
    getUseFriendListById(id: string): Promise<string[]>;
    ReturnNameById(id: string): Promise<string>;
    getUserByUsername(username: string): Promise<UserProfile>;
    changeUsername(username: string, id: string): Promise<UserProfile>;
    changeStatus(status: UserStatus, id: string): Promise<UserProfile>;
    addFriend(id: string, usernameFriend: string): Promise<UserProfile>;
    removeFriend(id: string, usernameFriend: string): Promise<UserProfile>;
}
