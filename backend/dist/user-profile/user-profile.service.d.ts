import { Repository } from 'typeorm';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserStatus } from './user-profile-status.model';
import { UserProfile } from './user.entity';
import { StatProfile } from './user.stat.entity';
export declare class UserProfileService {
    private readonly userEntity;
    private readonly statEntity;
    constructor(userEntity: Repository<UserProfile>, statEntity: Repository<StatProfile>);
    addFriendToID(userID: string, friendID: string): Promise<void>;
    removeFriendFromID(userID: string, friendID: string): Promise<void>;
    findAllUsers(filterDto: getTasksFilterDto): Promise<UserProfile[]>;
    findUserBy(id: string): Promise<UserProfile>;
    findUserName(username: string): Promise<UserProfile>;
    returnNameById(id: string): Promise<UserProfile>;
    changeStatus(status: UserStatus, id: string): Promise<UserProfile>;
    changeUsername(username: string, id: string): Promise<UserProfile>;
    addFriend(id: string, idfriend: string): Promise<UserProfile>;
    removeFriend(id: string, idfriend: string): Promise<UserProfile>;
    getAllUsersIntoList(): Promise<string[]>;
    getAllUsersByFriendList(id: string): Promise<string[]>;
    getAllUsersAddList(id: string): Promise<string[]>;
    getUsersListFriendById(id: string): Promise<string[]>;
}
