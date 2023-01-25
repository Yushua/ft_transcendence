import { Repository } from 'typeorm';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserProfile } from './user.entity';
export declare class UserProfileService {
    private readonly userEntity;
    constructor(userEntity: Repository<UserProfile>);
    findAllUsers(filterDto: getTasksFilterDto): Promise<UserProfile[]>;
}
