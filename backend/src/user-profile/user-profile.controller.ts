import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from 'src/auth/auth.guard';
import { AddAchievement } from './dto/addAchievement.dto';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';
import { MessageList } from './MessageList.entity';

@Controller('user-profile')

export class UserProfileController {
    constructor(private userServices: UserProfileService) {}

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
    async asyncgetUserById( @Param('id') id: string ){
        if (id == "undefined")
            return;
        var user:UserProfile = await this.userServices.findUserBy(id)
        return {user:user, username:user.username, profilePicture:user.profilePicture, experience:user.experience}
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
    @Get('SearchList/:friendName')
    async getSearchList(@Param('friendName') friendName:string) {
        var searchlist:string[][] = await this.userServices.SearchList(friendName)
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
        return { list: await this.userServices.GetFriendList(id) }
    }
        /**
     * 
     * @param username 
     * @returns add id based on the jwt authentication
     */
    @Patch('friendlist/add/:OtherId')
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    addFriend(
        @Request() req: Request, @Param('OtherId') friendID: string,
    ){
        return this.userServices.addFriend(req["user"].id, friendID);
    }

    @Patch('friendlist/remove/:idFriend/:id')
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async removeFriend(
        @Request() req: Request,
        @Param('idFriend') idfriend: string,
        @Param('id') id: string,
        ) {
        await this.userServices.removeFriend(id, idfriend);
    }
    
    @Get('friendlist/check/:idFriend')
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async checkFriend(
        @Request() req: Request,
        @Param('idFriend') idfriend: string,
        ) {
            return {status: await this.userServices.checkFriend(req["user"].id, idfriend)}
    }


    @Get("/username/:id")
    async ReturnNameById(
        @Param("id") id: string): Promise<string>
    {
        const found = this.userServices.returnNameById(id);
        return (await found).username;
    }

    @Post('/userchange/:username')
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    changeUsername(
        @Param('username') username: string, @Request() req: Request) {
        console.log("setting a new username")
        this.userServices.changeUsername(username, req["user"].id);
    }

    /*
        LeaderboardList
    */

    @Get("WinList")
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async GetWinList(
        ){
        return {list: await this.userServices.getWinList() }
    }

    @Get("ExpList")
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async GeExpList(
        ){
        return {list: await this.userServices.getExpList() }
    }  

    @Get("PongWinsList")
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async GetPongWinsList(
        ){
        return {list: await this.userServices.getPongWinsList() }
    }
    
    @Get("Experience/:id")
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async GetTotalExp(
        @Param("id") id:string
        ):Promise<number>{
        var user = await this.userServices.findUserBy(id)
        return user.experience
    }

    /*
        UserAchievement
    */

    @Get('GetAchievementListDone/:id')
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async GetAchievementListDone( @Param('id') id: string ) {

        return {  list: await this.userServices.GetUserAchievementDone(id) }
    }

    @Get('GetAchievementListNotDone/:id')
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async GetAchievementListNotDone( @Param('id') id: string ) {

        return {  list: await this.userServices.GetUserAchievementNotDone(id) }
    }

    @Get('GetAchievementListFull/:id')
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    async GetAchievementListFull( @Param('id') id: string ) {

        return {  list: await this.userServices.GetUserAchievementFull(id) }
    }

    /*
        MessageList
    */

        @Get('GetMessageList')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async GetMessageList( @Request() req: Request ):Promise<MessageList[]> {
            console.log(await this.userServices.getMessageList(req["user"].id))
            return  await this.userServices.getMessageList(req["user"].id)
        }

        @Post('removemessage/:id')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async removemessage( @Param("id") id:string ) {
            return  await this.userServices.RemoveMessageListWithID(id)
        }


        @Get('getAchieveMessageStatus')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async getAchievestatus( @Request() req: Request ) {
            var user:UserProfile = await this.userServices.findUserBy(req["user"].id)
            return  { status: user.YourAchievements}
        }

        @Post('PostAchieveMessageStatus/:status')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async PostAchievestatus( @Param("status") status:string, @Request() req: Request ) {
            if (status === "true"){
                await this.userServices.changeStatusAchieve(req["user"].id, true)
            }
            else {
                await this.userServices.changeStatusAchieve(req["user"].id, false)
            }
        }


        @Get('getServerMessageStatus')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async getServerMessageStatus( @Request() req: Request ) {
            var user:UserProfile = await this.userServices.findUserBy(req["user"].id)
            return  { status: user.YourMainMessages}
        }

        @Post('PostServerMessageStatus/:status')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async PostServerMessageStatus( @Param("status") status:string, @Request() req: Request ) {
            if (status === "true"){
                await this.userServices.changeStatusMessage(req["user"].id, true)
            }
            else {
                await this.userServices.changeStatusMessage(req["user"].id, false)
            }
        }

        @Get('GetNotificationStatus/:id')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async GetNotificationStatus( @Param("id") id:string, @Request() req: Request ) {
            return  { status: await this.userServices.checkCheckFrienddList(id, req["user"].id)}
        }

        @Patch('FrienddList/add/:id')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async FrienddListAdd( @Param("id") id:string, @Request() req: Request ) {
            await this.userServices.FrienddListAdd(id, req["user"].id)

        }

        @Patch('FrienddList/remove/:id')
        @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
        async FrienddListRemove( @Param("id") id:string, @Request() req: Request ) {
            await this.userServices.FrienddListRemove(id, req["user"].id)
        }

}
