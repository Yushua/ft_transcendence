import { Controller, Get, Param,  HttpException, HttpStatus, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from './auth.guard';
import { AuthService } from './auth.service';
import { randomBytes } from 'crypto';
import { UserTWT } from './userTWT.entity';

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

    /**
     * setup for the login
     * @param code 
     * @returns authtoken JWT token
     */
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
        const crypto = require('crypto');
        var secretCode:string = crypto.randomBytes(Math.ceil(10 / 2)).toString('hex').slice(0, 10)
        var accessToken:string = await this.AuthService.makeAccountJWT(intraName, secretCode)
        var TWToken:string = await this.AuthService.makeAccountTWT(intraName, secretCode)
        return {
            accessToken, TWToken: TWToken
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

    @UseGuards(AuthGuard())
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('checkStatusTWT:TWT')
    async getSatusTWT(@Param('TWT') TWT:string){
        return {status: await this.AuthService.getStatusTWT(TWT)}
    }
}
