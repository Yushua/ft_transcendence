import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
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

    /**
     * 
     * @param id 
     * @returns get all users in  list minus this user, using ID
     */
    @Get('/userList/:id')
    getUsesListById(
        @Param('id') id: string): Promise<string[]> {
        return this.userServices.getAllUsersByFriendList(id);
    }

     /**
     * 
     * @param id 
     * @returns get all users in  list minus this user, using ID
     */
        @Get('/userAddList/:id')
        getUserAddListById(
            @Param('id') id: string): Promise<string[]> {
            return this.userServices.getAllUsersAddList(id);
        }
    
    /**
     * 
     * @param id 
     * @returns get users friendslist
     */
    @Get('/userFriendList/:id')
    getUseFriendListById(
        @Param('id') id: string): Promise<string[]> {
        return this.userServices.getUsersListFriendById(id);
    }

    @Get("/username/:id")
    async ReturnNameById(
        @Param("id") id: string): Promise<string>
    {
        const found = this.userServices.returnNameById(id);
        return (await found).username;
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

    @Patch('/friendlist/add/:id/:idFriend')
    addFriend(
        @Param('id') id: string,
        @Param('idFriend') idFriend: string,
        )
        : Promise<UserProfile> {
        return this.userServices.addFriend(id, idFriend);
    }

    @Patch('/friendlist/remove/:id/:idFriend')
    removeFriend(
        @Param('id') id: string,
        @Param('idFriend') idfriend: string,
        )
        : Promise<UserProfile> {
        return this.userServices.removeFriend(id, idfriend);
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
