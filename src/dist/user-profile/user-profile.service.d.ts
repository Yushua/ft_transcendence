import { Repository } from 'typeorm';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserStatus } from './user-profile-status.model';
import { UserProfile } from './user.entity';
export declare class UserProfileService {
    private readonly userEntity;
    constructor(userEntity: Repository<UserProfile>);
    findAllUsers(filterDto: getTasksFilterDto): Promise<UserProfile[]>;
    findUserBy(id: string): Promise<UserProfile>;
    changeStatus(status: UserStatus, id: string): Promise<UserProfile>;
    changeUsername(username: string, id: string): Promise<UserProfile>;
}
