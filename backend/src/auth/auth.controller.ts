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
    @Redirect(`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2Fauth%2Ftoken&response_type=code`,
        301
    )
    redirect() {}

    @Get('token/:code')
    async getAuthToken(@Param('code') code: string, @Request() request, @Response() response):Promise<string>{
        console.log("I am in there backend")
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            client_secret: `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`,
            code: code,
            redirect_uri: "http://localhost:4242/",
            state: " super-secret",
        }
        // console.log(`intraname works == ${this.AuthService.OauthSystemCodeToAccess(request, response, dataToPost)}`)
        console.log(`\n\n${code}`);
        
        return await this.AuthService.OauthSystemCodeToAccess(request, response, dataToPost);
    }
}
