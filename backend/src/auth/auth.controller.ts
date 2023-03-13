import { Controller, Get, Inject, Post, Redirect, Res, Response, Request } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { Request } from 'node-fetch';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
    private AuthService: AuthService,
        @Inject(REQUEST) private readonly request: Request) {}
    
    // @Get('Oauth')
    // signUpQauth(@Res() res: Response): Promise<Boolean> {
        
    //     return true;
    // }

    @Get('login')
    @Redirect(`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2Fauth%2Ftoken&response_type=code`,
        301
    )
    redirect() {}

    @Get('token')
    async getAuthToken(@Request() request, @Response() response):Promise<void>{
        // console.log(`response ${request['url']}`)
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            client_secret: `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`,
            code: request['url'].split('code=')[1],
            redirect_uri: "http://localhost:4242/auth/token",
            state: " super-secret",
        }
        console.log(`[${dataToPost.code}]`)
        this.AuthService.OauthSystemCodeToAccess(request, response, dataToPost);
        //after done... go to the userprofile page. or,if email not set, set the email set page
        //make account
        //then go to setup account page
        //make sure to get the URl there and then log in. this way you create the authentication 
        //code
    }
}
