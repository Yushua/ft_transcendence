import { Controller, Get, Param, UseGuards, Request, Post, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from './auth.guard';
import { AuthService } from './auth.service';
import { authenticator } from '@otplib/preset-default';
import * as qrcode from 'qrcode'

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService,
    ) {}
    
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('getQRCode')
    async getQRCode(@Request() req: Request, @Res() response){
        var user = req["user"].username;
        const service = 'transendence';
        var secret: string = await this.AuthService.changeQRSecret(req["user"].id)
        const otpauth = authenticator.keyuri(user, service, secret);
        qrcode.toDataURL(otpauth, (err, imageUrl) => {
            if (err) {
              console.log('Error with QR');
              return;
            }
            response.status(200).send({QRCode: imageUrl})
          });
    }

    /**
     * Check QR code, if initialised, return a TWT with True
     * @returns 
     */
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('checkTWTCodeUpdate/:code')
    async checkTWTCodeUpdate(@Param('code') code: string, @Request() req: Request){
        if (await this.AuthService.checkCodeSecret(code, req["user"].QRSecret) == true){
            var TWT:string =  await this.AuthService.updateTWT(req["user"].id, true)
            await this.AuthService.updateTWTUser(req["user"].id, true)
            return {
                status:true,
                TWT: TWT,
                user: await this.AuthService.getUser(req["user"].id),
            }
        }
        else {
            console.log("failed")
            return {status: false}
        }
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('check')
    async getAuthJWTT(){
        return {
            result: true}}

    /**
     * setup for the login
     * @param code 
     * @returns authtoken JWT token
     */
    @Get('loginUser/:code')
    async getAuthToken(@Param('code') code: string) {
        const dataToPost = {
            grant_type: 'authorization_code',
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
            code: code,
            redirect_uri: process.env.redirect_uri,
            state: process.env.state,
        }
        var OAuthToken:string = await this.AuthService.OauthSystemCodeToAccess(dataToPost)
        var intraName:string = await this.AuthService.startRequest(OAuthToken)
        var accessToken:string = await this.AuthService.makeAccountJWT(intraName)

        await this.AuthService.makeAccountJWT(`${intraName}1`)
        await this.AuthService.makeAccountJWT(`${intraName}2`)
        await this.AuthService.makeAccountJWT(`${intraName}3`)
        await this.AuthService.makeAccountJWT(`${intraName}4`)
        return {
            accessToken: accessToken, intraname: intraName, OAuthToken: OAuthToken
        }
    }


    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('LogoutOauth/:token')
    async getLogoutOauth(@Param('token') token: string){
        return {status : await this.AuthService.logoutOathSystem(token)}
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('makeNewTWT')
    async getNewTWT(@Param('code') code: string, @Request() req: Request) {
        var TWToken:string = await this.AuthService.makeAccountTWT(req["user"].intraName)
        return {
            TWToken
        }
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('ChangeUsername/:username')
    async setNewUsername(@Param('username') username: string,  @Request() req: Request){
        await this.AuthService.changeUsername(`${username}1`, `${req["user"].intraName}1`)
        await this.AuthService.changeUsername(`${username}2`, `${req["user"].intraName}2`)
        await this.AuthService.changeUsername(`${username}3`, `${req["user"].intraName}3`)
        await this.AuthService.changeUsername(`${username}4`, `${req["user"].intraName}4`)
        return {
            status: await this.AuthService.changeUsername(username, req["user"].intraName)
    }}

    @Get('checkStatusTWT/:TWT')
    async getStatusTWT(@Param('TWT') TWT: string){
        return {status:  await this.AuthService.getStatusTWT(TWT)}
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('checkUserTWTStatus')
    async getUserStatusTWT(@Request() req: Request){
        return {status:  req["user"].TWTStatus}
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
    @Get('ChangeUserTWTStatusFalse')
    async ChangeUserStatusTWTFalse(@Request() req: Request){
        await this.AuthService.updateTWTUser(req["user"].id, false)
    }
}
