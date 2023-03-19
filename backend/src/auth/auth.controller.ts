import { Controller, Get, Param,  HttpException, HttpStatus, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from './auth.guard';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService,
    ) {}

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('check')
    async getAuthJWTToken(){
        console.log("i am in")
        var result:boolean = true;
        return {
            result
        }
    }

    @Get('token/:code')
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
        return {
            code, accessToken: await this.AuthService.makeAccount(intraName), twoFactorToken: await this.AuthService.controllerGetAuthToken(intraName)
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

    @UseGuards(AuthGuard())
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('ChangeUsername/:username')
    async setNewUsername(@Param('username') username: string,  @Request() req: Request){
    return {
        status: await this.AuthService.changeUsername(username, req["user"].intraName)
    }}

    @UseGuards(AuthGuard())
    @Post('changeStatusAuth/:status')
    async getNewAuthToken(@Param('status') status: boolean,  @Request() req: Request){
        var secretCode:string = crypto.randomBytes(Math.ceil(10 / 2)).toString('hex').slice(0, 10)
        return { twoFactorToken: await this.AuthService.controllergetNewAuthToken(req["user"].id, status, secretCode)}
    }

    /**
     * first check in the UserTFT if its on or not
     * ifnot, return false, thenit is not on
     * if it is true, and in the TFT it is true, then it already was on
     * if it is true and in the TFT it is false, then it is not enabled
     * @param token 
     * @param req 
     * @returns 
     */
    @UseGuards(AuthGuard())
    @Post('checkTwoStatus/:token')
    async checkTwoStatus(@Param('token') token: string){ 
        var status:boolean = await this.AuthService.controllerCheckTwoStatus(token)
       return { status }
    }
}
