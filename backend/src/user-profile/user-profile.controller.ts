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
        return {user: req["user"], username: req["user"].username, intraname: req["user"].intraName};
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

    /* search list templates*/

    /**
     * 
     * @param id 
     * @returns returns all the users [["pfp", "username"]]
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('SearchList')
    async getSearchList() {
        return { searchlist: await this.userServices.SearchList() }
    }

     /**
     * 
     * @param id 
     * @returns returns based on [["pfp", "username", "status"]]
     */
     @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('GetFriendList')
    async GetFriendList( @Request() req: Request) {
        return { friendlist: await this.userServices.GetFriendList(req["user"].id) }
    }

    
    //add user
    //remove user
    

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
        @Param('username') username: string, @Request() req: Request): Promise<UserProfile> {
        return this.userServices.changeUsername(username, req["user"].id);
    }

    /**
     * 
     * @param username 
     * @returns add id based on the jwt authentication
     */
    @Patch('friendlist/add/:usernameFriend')
    @UseGuards(AuthGuard())
    addFriend(
        @Request() req: Request, @Param('usernameFriend') usernameFriend: string,
        ){
        return this.userServices.addFriend(req["user"].id, usernameFriend);
    }

    @Patch('friendlist/remove/:idFriend')
    @UseGuards(AuthGuard())
    removeFriend(
        @Request() req: Request,
        @Param('idFriend') idfriend: string,
        ) {
        this.userServices.removeFriend(req["user"].id, idfriend);
    }

}
