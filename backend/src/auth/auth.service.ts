import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { UserTWT } from './userTWT.entity';

export class AuthService {
    constructor(
      @InjectRepository(UserProfile)
      private readonly userProfileEntityRepos: Repository<UserProfile>,
      @InjectRepository(UserTWT)
      private readonly userTWTEntityRepos: Repository<UserTWT>,
      private readonly jwtService: JwtService,
  ) {}
  
      /**
       * 
       * @returns returns AccessToken
       */
      async OauthSystemCodeToAccess(data:Object):Promise<string>{
        var accessToken:string;
        try {
            await axios.post(`https://api.intra.42.fr/oauth/token`, data).then((response) => {
              accessToken = response.data['access_token'];
            })
          } catch (error) {
            console.log(error.response.data)
            console.log("Post")
            throw new HttpException('intraPull failed, problem with OAuth API. input Data out of date', HttpStatus.BAD_REQUEST);
        }
        return accessToken
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
      async makeAccountJWT(intraName: string, secretcode: string):Promise<string>{
        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ intraName })
        if(!user){
          user = this.userProfileEntityRepos.create({
            intraName
          });
          try {
            await this.userProfileEntityRepos.save(user);
          } catch (error) {
            throw new HttpException(`creating an account for the first time with ${intraName}\ncannot be created on the database`, HttpStatus.BAD_REQUEST);
          }
        }
        //two factor authentication, but how? if this is true, then log out.
        const payload: JwtPayload = { userID: user.id, twoFactor: false, secretcode};
        const authToken: string = this.jwtService.sign(payload);
        return authToken;
      }

      /**
       * 
       * @param intraName make a TWT if intraname is new
       */
      async makeAccountTWT(intraName: string, secretcode: string):Promise<string>{
        var userp:UserProfile= await this.userProfileEntityRepos.findOneBy({ intraName })
        var user:UserTWT = await this.userTWTEntityRepos.findOneBy({ id: userp.id })
        if(!user){
          user = this.userTWTEntityRepos.create({ id: userp.id, TWT: false, secretcode });
          try {
            await this.userTWTEntityRepos.save(user);
          } catch (error) {
            throw new HttpException(`creating an account for the first time with ${userp.id}\ncannot be created on the database`, HttpStatus.BAD_REQUEST);
          }
          //two factor authentication, but how? if this is true, then log out.
          const payload: JwtPayload = { userID: user.id, twoFactor: false, secretcode};
          const TWToken: string = this.jwtService.sign(payload);
          return TWToken;
        }
        else {
          return "";
        }
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
        const payload: JwtPayload = { userID: user.id, twoFactor: false, secretcode: ""};
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
        if (!user){
          var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ intraName })
          user.username = username;
          await this.userProfileEntityRepos.save(user);
          return true
        }
        return false
      }
      
      async changeStatusAuth(twoFactor:boolean, id:string){
        var accessToken = ""
        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ id })
        user.twoFactor = twoFactor;
        await this.userProfileEntityRepos.save(user);
      }

      async getStatusTWT(TWT:string){
        var token = this.jwtService.decode(TWT);
        return token["TWT"]
      }
}
