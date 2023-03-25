import { Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from 'src/auth/auth.guard';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';

@Controller('user-profile')
@UseGuards(AuthGuard())
export class UserProfileController {
    constructor(private userServices: UserProfileService) {}
    
    //middleware 

    /**
     * 
     * @param username 
     * @returns returns the user based on the JWT authenticaiton
     */
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('/user')
    getUserByIdRequest(
        @Request() req: Request) {
        return {user: req["user"], username: req["user"].username, intraname: req["user"].intraname};
    }

    /**
     * 
     * @param usernam 
     * @returns returns the user based on the id
     */
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('/user/:id')
    getUserById( 
        @Param('id') id: string){
        if (id == "undefined")
            return;
        return { user: this.userServices.findUserBy(id) }
    }

    /**
     * 
     * @param username 
     * @returns turns an username into an ID
     */
    @Get('/returnID/:username')
    getReturnID(@Param('username') username:string): Promise<UserProfile> {
        return this.userServices.ReturnWithUsername(username);
    }

    /**
     * 
     * @param username 
     * @returns turns an ID into an username
     */

    @Get('/returnUsername/:id')
    getReturnUsername(@Param('id') id:string): Promise<string> {
        return this.userServices.ReturnUsername(id);
    }


    /**
     * 
     * @param id 
     * @returns get all users in  list minus this user, using ID
     */
        @Get('/userList/:id')
        getUserFriendlistID(
            @Param('id') id: string): Promise<string[]> {
            return this.userServices.UsersFriendlistID(id);
        }

    /**
     * 
     * @param id 
     * @returns get all users in a list minus this user, using ID
     */
    @Get('/userList/:id')
    getUserFriendlistusername(
        @Param('id') id: string): Promise<string[]> {
        return this.userServices.UsersFriendlistUsername(id);
    }

     /**
     * 
     * @param id 
     * @returns get users all people the user can add, using ID.
     */
        @Get('/userAddList/:id')
        getUserAddListById(
            @Param('id') id: string): Promise<string[]> {
            return this.userServices.getAllUsersAddList(id);
        }
         /**
     * 
     * @param id 
     * @returns get users all people the user can add, using ID. 
     * return array of usernames
     */
         @Get('/userAddListusername')
         @UseGuards(AuthGuard())
         getUserAddListByIdUsername(
            @Request() req: Request): Promise<string[]> {
             return this.userServices.getAllUsersAddListUsername(req["user"].id);
         }
    
    /**
     * 
     * @param id 
     * @returns get users friendlist with usernames
     */
        @Get('/userFriendListID')
        @UseGuards(AuthGuard())
        getUseFriendListIDById(
            @Request() req: Request): Promise<string[]> {
            return this.userServices.UsersFriendlistID(req["user"].id);
        }
    
    /**
     * 
     * @param id 
     * @returns get users friendlist with usernames
     */
        @Get('/userFriendListUsername/:id')
        getUseFriendListUsernameById(
            @Param('id') id: string): Promise<string[]> {
            return this.userServices.UsersFriendlistUsername(id);
        }

    @Get("/username/:id")
    async ReturnNameById(
        @Param("id") id: string): Promise<string>
    {
        const found = this.userServices.returnNameById(id);
        return (await found).username;
    }

    @Post('/userchange/:username')
    @UseGuards(AuthGuard())
    changeUsername(
        @Param('username') username: string,
        @Request() req: Request): Promise<UserProfile> {
        return this.userServices.changeUsername(username, req["user"].id);
    }

    /**
     * 
     * @param username 
     * @returns add id based on the jwt authentication
     */
    @Patch('/friendlist/add/:idFriend')
    @UseGuards(AuthGuard())
    addFriend(
        @Request() req: Request,
        @Param('idFriend') idFriend: string,
        )
        : Promise<UserProfile> {
        return this.userServices.addFriend(req["user"].id, idFriend);
    }

    @Patch('/friendlist/remove/:idFriend')
    @UseGuards(AuthGuard())
    removeFriend(
        @Request() req: Request,
        @Param('idFriend') idfriend: string,
        )
        : Promise<UserProfile> {
        return this.userServices.removeFriend(req["user"].id, idfriend);
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
