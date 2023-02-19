import { CreateUserDto } from './dto/create-user.dto';
import { getUserFilterDto } from './dto/get-user-filter.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { User } from './user.entity';
import { UserManagementService } from './user-management.service';
export declare class UserManagementController {
    private userManagementService;
    constructor(userManagementService: UserManagementService);
    postUser(createUserDto: CreateUserDto): Promise<User>;
    patchUserIdStatus(id: string, updateUserStatusDto: UpdateUserStatusDto): Promise<User>;
    getAllUsers(filterDto: getUserFilterDto): Promise<User[]>;
    getUserById(id: string): Promise<User>;
}
