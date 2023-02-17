import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { getUserFilterDto } from './dto/get-user-filter.dto';
import { User } from './user.entity';
import { UserStatus } from './user-status.model';
export declare class UserManagementService {
    private readonly userEntity;
    constructor(userEntity: Repository<User>);
    insert(createUserDto: CreateUserDto): Promise<User>;
    findUserById(id: string): Promise<User>;
    updateUserStatus(id: string, status: UserStatus): Promise<User>;
    getAllTasks(filterDto: getUserFilterDto): Promise<User[]>;
}
