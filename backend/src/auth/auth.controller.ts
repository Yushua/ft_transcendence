import { Controller, Get, Param,  HttpException, HttpStatus, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from './auth.guard';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';
import { TwoFactorAuthService } from '../two-factor-auth/two-factor-auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService,
        private TwoFactorAuthServices: TwoFactorAuthService,
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

    @Get('token/:code/:tft')
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

        var accessToken:string = await this.AuthService.makeAccount(intraName)
        //if you create the account BUT the tft is already there. then something is wrong
        if (tft == undefined){
            var secretCode:string = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
            var twoFactorToken:string = await this.TwoFactorAuthServices.createNewToken(await this.AuthService.getUserID(intraName), false, secretCode)
            throw new HttpException('Two Factor Token is already there', HttpStatus.BAD_REQUEST);
        }
        else {
            twoFactorToken = tft
        }
        return {
            code, accessToken, twoFactorToken: tft
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
        await this.AuthService.changeStatusAuth(status, req["user"].id)
        return
    }

}
