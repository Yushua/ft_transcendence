import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';

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
      async makeAccount(intraName: string):Promise<string>{
        var authToken:string = ""

        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ intraName })
        if(!user){
          return ""
        }
        const userID = user.id;
        const payload: JwtPayload = { userID };
        const aauthToken: string = this.jwtService.sign(payload);
        return authToken;
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
        const payload: JwtPayload = { userID: user.id };
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
}
