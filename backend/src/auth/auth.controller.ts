import { Controller, Get, Param,  HttpException, HttpStatus, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService,
    ) {}

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('check')
    async getAuthJWTT(){
        return {
            result: true}}
    
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('checkTWT/:token/:code')
    async getAuthJWTToken(@Param('token') token: string, @Param('code') code: string, @Request() req: Request){
        //chec if the token is correct. else....logout
        var TWT:string =  await this.AuthService.updateTWT(token, true)
        //update User
        await this.AuthService.updateTWTUser(req["user"].id, true)
        console.log("check succesfull")
        return {
            status:true,
            TWT: TWT
        }
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('checkTWTOn/:token/:code')
    async getAuthJWTTokenOn(@Param('token') token: string, @Param('code') code: string, @Request() req: Request){
        await this.AuthService.updateTWTUser(req["user"].id, true)
        var TWT:string = await this.AuthService.updateTWT(req["user"].id, true)
        console.log(`status = ${await this.AuthService.getStatusTWT(TWT)}`)
        return {
            status:true,
            TWT: TWT
        }
    }

    /**
     * setup for the login
     * @param code 
     * @returns authtoken JWT token
     */
    @Get('loginUser/:code')
    async getAuthToken(@Param('code') code: string) {
        //get data from conf, if anything is NULL, because conf is not there, return error access
        //because conf is not there
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            client_secret: `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`,
            code: code,
            redirect_uri: "http://localhost:4242/",
            state: " super-secret",
        }
        var OAuthToken:string = await this.AuthService.OauthSystemCodeToAccess(dataToPost)
        var intraName:string = await this.AuthService.startRequest(OAuthToken)
        var accessToken:string = await this.AuthService.makeAccountJWT(intraName)
        return {
            accessToken, intraname: intraName
        }
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('makeNewTWT')
    async getNewTWT(@Param('code') code: string, @Request() req: Request) {
        console.log("make TWT account")
        var TWToken:string = await this.AuthService.makeAccountTWT(req["user"].intraName)
        console.log(`token made {${TWToken}}`)
        return {
            TWToken
        }
    }

    @Get('token/:code/:TWT')
    async getAuthTokenTWTDisable(@Param('code') code: string, @Param('TWT') TWT: string) {
        //get data from conf, if anything is NULL, because conf is not there, return error access
        //because conf is not there
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            client_secret: `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`,
            code: code,
            redirect_uri: "http://localhost:4242/",
            state: " super-secret",
        }
        console.log("in here")
        var OAuthToken:string = await this.AuthService.OauthSystemCodeToAccess(dataToPost)
        var intraName:string = await this.AuthService.startRequest(OAuthToken)
        if (await this.AuthService.disableLoginCheck(TWT, intraName) == false){
            throw new HttpException(`used a wrong login, Intraname does not compare to the user logged in`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        var TWToken:string = await this.AuthService.updateTWT(TWT, false)
        return {
            TWToken: TWToken, status: true
        }
    }

    @Get('loginNew/:code/:username')
    async getNewAccount(@Param('code') code: string, @Param('username') username: string){
        console.log(`code ${code}`)
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            client_secret: `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`,
            code: code,
            redirect_uri: "http://localhost:4242/",
            state: " super-secret",
        }
        var OAuthToken:string = await this.AuthService.OauthSystemCodeToAccess(dataToPost)
        var intraName:string = await this.AuthService.startRequest(OAuthToken)
        //if intraName already exist
        if ( await this.AuthService.usernameUserExist(username) == true){
            throw new HttpException('Username already in use', HttpStatus.FORBIDDEN);
        }
        if ( await this.AuthService.intraNameUserExist(intraName) == true){
            throw new HttpException('Intraname already in use', HttpStatus.FORBIDDEN);
        }
        var accessToken:string = await this.AuthService.newAccountSystem(intraName, username)
        return {accessToken}
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('ChangeUsername/:username')
    async setNewUsername(@Param('username') username: string,  @Request() req: Request){
        return {
            status: await this.AuthService.changeUsername(username, req["user"].intraName)
    }}

    @Get('checkStatusTWT/:TWT')
    async getStatusTWT(@Param('TWT') TWT: string){
        return {status:  await this.AuthService.getStatusTWT(TWT)}
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('checkUserTWTStatus')
    async getUserStatusTWT(@Request() req: Request){
        return {status:  req["user"].TWTStatus}
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('ChangeUserTWTStatusFalse')
    async ChangeUserStatusTWTFalse(@Request() req: Request){
        await this.AuthService.updateTWTUser(req["user"].id, false)
    }
}
