import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';
export declare class UserProfileController {
    private taskServices;
    constructor(taskServices: UserProfileService);
    getAllTasks(filterDto: getTasksFilterDto): Promise<UserProfile[]>;
}
