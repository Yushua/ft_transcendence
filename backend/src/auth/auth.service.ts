import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { response } from 'express';
import { redirect } from 'react-router-dom';
import { AuthCredentialsDto } from 'src/login/dto/auth-credentials.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {

      async check():Promise<void>{
        console.log("guard is working")
      }

      async OauthSystem(res: Response):Promise<boolean>{
        var OauthResponseGet:string = `https://api.intra.42.fr/oauth/authorize`
        var Client_id:string = 'u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c'
        var ClientSecret:string = `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`
        var Redirect_uri:string = "http://localhost:4243/"
        var Scope:string = "public"
        var State:string = " super-secret"
        var Response_type:string = `code`
        console.log("here1")        
        const config = {
          client: {
            id: Client_id,
            secret: ClientSecret
          },
          auth: {
            tokenHost: `https://api.intra.42.fr/oauth/authorize`
          }
        };
        console.log("here2") 
        const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');
        const client = new AuthorizationCode(config);
        const authorizationUri = client.authorizeURL({
          redirect_uri: Redirect_uri,
          scope: Scope,
          state: State
        });
        console.log("here3")

        redirect(authorizationUri);
        console.log(`response == ${response}`)
        
        const tokenParams = {
          // code: res.code,
          redirect_uri: Redirect_uri,
          scope: Scope,
        };
        console.log("here4") 
        var Token:string = ""
        try {
          const accessToken = await client.getToken(tokenParams);
          console.log`accessToken == ${accessToken}`
          Token = accessToken;
        } catch (error) {
          console.log('Access Token Error', error.message);
        }
        console.log("done")
        var tokenRequest:string = "https://api.up42.com/oauth/token";//to get a tmp token to use
        return false;
      }
}
