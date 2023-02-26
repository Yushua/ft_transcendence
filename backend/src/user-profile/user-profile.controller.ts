import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { AddFriendListDto } from './dto/create-user.dto copy';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateUserStatusDto } from './dto/update-task-status.dto';
import { UserStatus } from './user-profile-status.model';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';

@Controller('user-profile')
export class UserProfileController {
    constructor(private userServices: UserProfileService) {}

    @Get('/user')
    getAllTasks(@Query() filterDto: getTasksFilterDto): Promise<UserProfile[]> {
        return this.userServices.findAllUsers(filterDto);
    }
 
    @Get('/user/:id')
    getUserById(
        @Param('id') id: string): Promise<UserProfile> {
        return this.userServices.findUserBy(id);
    }

    @Get('/userList/:id')
    getUsesListById(
        @Param('id') id: string): Promise<string[]> {
        //get the user list, minus the block and minus the friend list
        return this.userServices.getUsersListFriendById(id);
    }

    @Get("user/:id")
    async ReturnNameById(
        @Param("id") id: string): Promise<string>
    {
        const found = this.userServices.returnNameById(id);
        return (await found).username;
    }
    
    @Get('/user/:username')
    getUserByUsername(
        @Param('username') username: string): Promise<UserProfile> {
        return this.userServices.findUserBy(username);
    }
    // @Get('/status/:offline')
    // getAllStatusOffline(
    //     ): Promise<UserProfile> {
    //     return this.userServices.findUserBy(UserStatus.OFFLINE);
    // }

    // @Get('/status/:online')
    // getAllStatusOnline(
    //     ): Promise<UserProfile> {
    //     return this.userServices.findUserBy(UserStatus.ONLINE);
    // }

    @Post('/userchange/:id/:username')
    changeUsername(
        @Param('username') username: string,
        @Param('id') id: string): Promise<UserProfile> {
        return this.userServices.changeUsername(username, id);
    }
    @Patch('/status/:status')
    changeStatus(
        @Param('status') status: UserStatus,
        @Param('id') id: string): Promise<UserProfile> {
        return this.userServices.changeStatus(status, id);
    }

    @Patch('/status/:id/:usernameFriend')
    addFriend(
        @Param('id') id: string,
        @Param('usernameFriend') usernameFriend: string,
        )
        : Promise<UserProfile> {
        return this.userServices.addFriend(id, usernameFriend);
    }

    /*
        front app application will test
        this week;
    */
    /*
    when a game is created, look into the suer if the suer has the stats there
    if yes, the  continue, if not, then create one
    */
}
