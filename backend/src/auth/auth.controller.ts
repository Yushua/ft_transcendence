import { Controller, Get, Inject, Post, Redirect, Res, Response, Request, Param } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { Request } from 'node-fetch';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService,
    ) {}
    
    @Get('Oauth')
    signUpQauth(): Promise<void> {
       console.log("here")
       return;
    }

    @Get('login')
    @Redirect(`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4243%2F&response_type=code`,
        301
    )
    redirect() {}

    @Get('token/:code')
    async getAuthToken(@Param('code') code: string) {
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            client_secret: `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`,
            code: code,
            redirect_uri: "http://localhost:4243/",
            state: " super-secret",
        }
        var accesssToken:string = await this.AuthService.OauthSystemCodeToAccess(dataToPost)
        var intraName:string = await this.AuthService.startRequest(accesssToken)
        return {
            accesssToken, intraName, dataToPost
        }
    }

    @Get('login/:intraName')
    async getAuthorization(@Param('intraName') intraName: string){
        var check:boolean = await this.AuthService.checkUserExist(intraName)
        var authorizationToken:string;
        var path:JSX.IntrinsicElements;
        //check if the suer exist, if now, create, and change status to <create account>
        if ( check == false){
            //make account
        }
        //login account
        return {
            authorizationToken, path, check
        }
    }
}
