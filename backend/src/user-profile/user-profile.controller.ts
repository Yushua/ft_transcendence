import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from 'src/auth/auth.guard';
import { AddAchievement } from './dto/addAchievement.dto';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';

@Controller('user-profile')
// @UseGuards(AuthGuard())
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
        var searchlist:string[][] = await this.userServices.SearchList()
        return { searchlist: searchlist }
    }

     /**
     * 
     * @param id 
     * @returns returns based on [["pfp", "username", "status"]]
     */
     @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('GetFriendList/:id')
    async GetFriendList( @Param('id') id: string) {
        return { friendlist: await this.userServices.GetFriendList(id) }
    }
        /**
     * 
     * @param username 
     * @returns add id based on the jwt authentication
     */
    @Patch('friendlist/add/:OtherId')
    @UseGuards(AuthGuard())
    addFriend(
        @Request() req: Request, @Param('OtherId') OtherId: string,
        ){
        return this.userServices.addFriend(req["user"].id, OtherId);
    }

    @Patch('friendlist/remove/:idFriend/:id')
    @UseGuards(AuthGuard())
    removeFriend(
        @Request() req: Request,
        @Param('idFriend') idfriend: string,
        @Param('id') id: string,
        ) {
        this.userServices.removeFriend(id, idfriend);
    }
    @Patch('friendlist/check/:idFriend/:id')
    @UseGuards(AuthGuard())
    checkFriend(
        @Request() req: Request,
        @Param('idFriend') idfriend: string,
        @Param('id') id: string,
        ) {
        this.userServices.checkFriend(id, idfriend);
    }
    
    /**
     * 
     * @param id 
     * @returns returns based on [["pfp", "username", "status"]]
     */
    // @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('GetAchievementList/:id')
    async GetAchievementList( @Param('id') id: string ) {

        return {  list: await this.userServices.GetUserAchievment(id) }
    }
    /**
     * 
     * @param id 
     * @returns returns based on [["pfp", "username", "status"]]
     */
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Post('PostAchievementList')
    async postAchievementList( @Request() req: Request,
        @Body() AddAchievement: AddAchievement) {
        await this.userServices.postAchievementList(req["user"].id, AddAchievement)
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
        @Param('username') username: string, @Request() req: Request): Promise<UserProfile> {
        return this.userServices.changeUsername(username, req["user"].id);
    }

    /*
        LeaderboardList
    */

    @Get("WinList")
    async GetWinList(
        @Request() req: Request ){
        return {list: await this.userServices.getWinList(req["user"].id) }
    }

    @Get("ExpList")
    async GeExpList(
        @Request() req: Request ){
        return {list: await this.userServices.getExpList(req["user"].id) }
    }  

    @Get("PongWinsList")
    async GetPongWinsList(
        @Request() req: Request ){
        return {list: await this.userServices.getPongWinsList(req["user"].id) }
    }  
}
