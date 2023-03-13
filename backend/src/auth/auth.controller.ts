import { Controller, Get, Inject, Post, Redirect, Res, Response, Request } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { Request } from 'node-fetch';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
    private AuthService: AuthService,
        @Inject(REQUEST) private readonly request: Request) {}
    
    @Get('Oauth')
    signUpQauth(@Res() res: Response): Promise<Boolean> {
        
        return this.AuthService.OauthSystem(res);
    }

    @Get('login')
    @Redirect(`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4243%2F&response_type=code`,
        303
    )
    redirect() {}

    @Get('token')
    async getAuthToken(@Request() request, @Response() response):Promise<void>{
        var Client_id:string = 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c'
        var ClientSecret:string = `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`
        var code:string //return code from function before
        var Redirect_uri:string = "http://localhost:4243/auth/token"

        const dataToPost = {
            type: 'authorization_doze',
            Client_id: 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c',
            ClientSecret: `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`,
            code: request['url'].split('code=')[1],
            Redirect_url: "http://localhost:4243/auth/token",
        }
        console.log(` data code back == ${dataToPost.code}`)
    }
}
