import { Inject, Injectable, Request, Response, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import e, { response } from 'express';
import axios from 'axios';
import { redirect } from 'react-router-dom';
import { AuthCredentialsDto } from 'src/login/dto/auth-credentials.dto';

export class AuthService {

      async check():Promise<void>{
        console.log("guard is working")
      }

      async OauthSystemCodeToAccess(request: Request , response: Response, data):Promise<void>{
        var accessToken:string;
        console.log("i am here")
        try {
            await axios.post(`https://api.intra.42.fr/oauth/token`, data).then((response) => {
              accessToken = response.data['access_token'];
            })        
        } catch (error) {
          alert("error in ToAccess")
        }
        console.log(` accessToken == ${accessToken}`)
        await this.startRequest(request, response, accessToken, data)
      }

      async startRequest(request: Request , response: Response, accessToken: string, data):Promise<void>{
        var userID:string
        var intraName:string;
        try {
          const intraPull = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          }).then((response) => {
            intraName = response['data'].login
          })
        } catch (error) {
          alert("error in startRequest")
        }

        console.log(`intraName == ${intraName}`)
      }

}
