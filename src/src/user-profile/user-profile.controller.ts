import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateUserStatusDto } from './dto/update-task-status.dto';
import { UserStatus } from './user-profile-status.model';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';

@Controller('user-profile')
export class UserProfileController {
    constructor(private taskServices: UserProfileService) {}

    @Get('/user')
    getAllTasks(@Query() filterDto: getTasksFilterDto): Promise<UserProfile[]> {
        return this.taskServices.findAllUsers(filterDto);
    }

    @Get('/user/:id')
    getUserById(
        @Param('id') id: string): Promise<UserProfile> {
        return this.taskServices.findUserBy(id);
    }
    @Get('/user/:username')
    getUserByUsername(
        @Param('username') username: string): Promise<UserProfile> {
        return this.taskServices.findUserBy(username);
    }
    // @Get('/status/:offline')
    // getAllStatusOffline(
    //     ): Promise<UserProfile> {
    //     return this.taskServices.findUserBy(UserStatus.OFFLINE);
    // }
    // @Get('/status/:online')
    // getAllStatusOnline(
    //     ): Promise<UserProfile> {
    //     return this.taskServices.findUserBy(UserStatus.ONLINE);
    // }
    @Patch('/username')
    changeUsername(
        @Param('username') username: string,
        @Param('id') id: string): Promise<UserProfile> {
        return this.taskServices.changeUsername(username, id);
    }

    @Patch('/status/:status')
    changeStatus(
        @Param('status') status: UserStatus,
        @Param('id') id: string): Promise<UserProfile> {
        return this.taskServices.changeStatus(status, id);
    }
}
