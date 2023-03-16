import { Controller, Get, Inject, Post, Redirect, Res, Response, Request, Param, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { Request } from 'node-fetch';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService,
    ) {}

    @Get('token/:code')
    async getAuthToken(@Param('code') code: string) {
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            client_secret: `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`,
            code: code,
            redirect_uri: "http://localhost:4242/",
            state: " super-secret",
        }
        var accesssToken:string = await this.AuthService.OauthSystemCodeToAccess(dataToPost)
        var intraName:string = await this.AuthService.startRequest(accesssToken)
        var authToken:string = await this.AuthService.makeAccount(intraName)
        //if account is now yet created, then you can't log in yet
        return {
            code, authToken
        }
    }

    @Get('loginNew/:code/:username')
    async getNewAccount(@Param('code') code: string, @Param('username') username: string){
        if ( await this.AuthService.usernameUserExist(username) == true){
            throw new HttpException('Username already in use', HttpStatus.FORBIDDEN);
        }
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            client_secret: `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`,
            code: code,
            redirect_uri: "http://localhost:4242/",
            state: " super-secret",
        }
        var accesssToken:string = await this.AuthService.OauthSystemCodeToAccess(dataToPost)
        var intraName:string = await this.AuthService.startRequest(accesssToken)
        //if intraName already exist
        if ( await this.AuthService.intraNameUserExist(intraName) == true){
            throw new HttpException('Intraname already in use', HttpStatus.FORBIDDEN);
        }
        var authToken:string = await this.AuthService.newAccountSystem(intraName, username)
        return {authToken}
    }
}
