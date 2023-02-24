import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserStatus } from './user-profile-status.model';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';
export declare class UserProfileController {
    private userServices;
    constructor(userServices: UserProfileService);
    getAllTasks(filterDto: getTasksFilterDto): Promise<UserProfile[]>;
    getUserById(id: string): Promise<UserProfile>;
    ReturnNameById(id: string): Promise<string>;
    getUserByUsername(username: string): Promise<UserProfile>;
    changeUsername(username: string, id: string): Promise<UserProfile>;
    changeStatus(status: UserStatus, id: string): Promise<UserProfile>;
}
