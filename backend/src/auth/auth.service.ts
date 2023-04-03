import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { authenticator } from 'otplib';
import { randomBytes } from 'crypto';

export class AuthService {
    constructor(
      @InjectRepository(UserProfile)
      private readonly userProfileEntityRepos: Repository<UserProfile>,
      private readonly jwtService: JwtService,
  ) {}
  
      /**
       * 
       * @returns returns AccessToken
       */
      async OauthSystemCodeToAccess(data:Object):Promise<string>{
        var intraAccessToken:string;
        try {
            await axios.post(`https://api.intra.42.fr/oauth/token`, data).then((response) => {
              intraAccessToken = response.data['access_token'];
            })
          } catch (error) {
            console.log(error.response.data)
            console.log("Post")
            throw new HttpException('intraPull failed, problem with OAuth API. input Data out of date', HttpStatus.BAD_REQUEST);
        }
        return intraAccessToken
      }

      /**
       * 
       * @returns returns Intraname
       */
      async startRequest(accessToken: String):Promise<string>{
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
          console.log(error.response.data)
          console.log("Get")
          throw new HttpException('intraPull failed, problem with OAuth API. input Data out of date', HttpStatus.BAD_REQUEST);
        }
        console.log(`intraname ${intraName}`)
        return intraName
      }

      /** logging out of intra */
      async logoutOathSystem(token: string):Promise<boolean>{
        console.log("hello")
        try {
          const intraPull = await axios.get('https://api.intra.42.fr/oauth/logout', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }).then((response) => {
            return true
          })
        } catch (error) {
          console.log(error.response.data)
          console.log("Get")
          throw new HttpException('loging out failed, system corrupted', HttpStatus.BAD_REQUEST);
        }
        return false;
      }
      /**
       * 
       * @returns checs if the user exists and returns a boolean
       */
      async usernameUserExist(username: string):Promise<boolean>{
        console.log(`username ${username}`)
        const user = await this.userProfileEntityRepos.findOneBy({ username })
        if(user){
          return true
        }
        return false
      }

      /**
       * 
       * @returns checs if the user exists and returns a boolean
       */
      async intraNameUserExist(intraName: string):Promise<boolean>{
        const user = await this.userProfileEntityRepos.findOneBy({ intraName })
        if(user){
          return true
        }
        return false
      }
      
      /**
       * 
       * @param intraName makes account if intraname is new
       */
      async makeAccountJWT(intraName: string):Promise<string>{
        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ intraName })
        if(!user){
          user = this.userProfileEntityRepos.create({
            intraName, wins: 0, losses: 0,
          });
          try {
            await this.userProfileEntityRepos.save(user);
          } catch (error) {
            throw new HttpException(`creating an account for the first time with ${intraName}\ncannot be created on the database`, HttpStatus.BAD_REQUEST);
          }
        }
        //two factor authentication, but how? if this is true, then log out.
        console.log("JWT payload")
        const payload: JwtPayload = { userID: user.id, twoFactor: false};
        const authToken: string = this.jwtService.sign(payload);
        return authToken;
      }

      /**
       * 
       * @param intraName make a TWT , intraaccount now is new
       */
      async makeAccountTWT(intraName: string):Promise<string>{
        var user:UserProfile= await this.userProfileEntityRepos.findOneBy({ intraName })
          const payload: JwtPayload = { userID: user.id, twoFactor: false}
          const TWToken: string = this.jwtService.sign(payload);
          return TWToken;
      }

      /**
       * 
       * @param intraName 
       * @param username 
       * @param eMail 
       * @returns create account when it is new. its also checked
       */
      async newAccountSystem(intraName:string, username: string):Promise<string> {
        var authToken:string = ""
        var user:UserProfile
        user = this.userProfileEntityRepos.create({
            intraName, username
        });
        //add checks if the account creation fails
        try {
          await this.userProfileEntityRepos.save(user);
        } catch (error) {
          throw new HttpException(`username ${username} already in use`, HttpStatus.BAD_REQUEST);
        }
        console.log(` id = ${user.id}`)
        const payload: JwtPayload = { userID: user.id, twoFactor: false};
        try {
         const authToken = this.jwtService.sign(payload);          
        } catch (error) {
          console.log(error)
          console.log("authToken")
          throw new HttpException(`jwtService sign failed`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        console.log(`authtoken ${authToken}`)
        return authToken;
      }

      async changeUsername(username:string, intraName:string):Promise<boolean>{
        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ username })
        console.log(user)
        if (!user){
          var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ intraName })
          user.username = username;
          await this.userProfileEntityRepos.save(user);
          return true
        }
        return false
      }

      async updateTWTUser(id: string, status:boolean){
        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ id })
        user.TWTStatus = status
        await this.userProfileEntityRepos.save(user);
      }
      
      async getStatusTWT(TWT:string){
        var token = this.jwtService.decode(TWT);
        return token["twoFactor"]
      }

      async updateTWT(userID:string, status:boolean):Promise<string>{
        const payload: JwtPayload = { userID, twoFactor: status};
        const TWToken: string = this.jwtService.sign(payload);
        return TWToken
      }

      async disableLoginCheck(TWT:string, intraName:string):Promise<boolean>{
        var token = this.jwtService.decode(TWT);
        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ intraName })
        if (!user || (intraName == user.intraName))
          return true
        return false
      }

      /**
       * validating TWT code input from QR
       * @param code 
       * @returns 
       */
      async checkCodeSecret(code:string, secret:string):Promise<boolean>{
        try {
          const isValid = authenticator.check(code, secret);
          // or
          // const isValid = authenticator.verify({ token, secret });
        } catch (err) {
          console.log("failed")
          return false
        }
        console.log("success")
        return true
      }

      async changeQRSecret(id: string):Promise<string>{
        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ id })
        var secret: string = authenticator.generateSecret(20);
        user.QRSecret = secret
        await this.userProfileEntityRepos.save(user);
        return secret
      }

      async getUser(id: string):Promise<UserProfile> {
        return await this.userProfileEntityRepos.findOneBy({ id })
      }
}
