import { ConflictException, InternalServerErrorException } from '@nestjs/common';
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
      private jwtService: JwtService,
  ) {}
      /**
       * 
       * @returns returns AccessToken
       */

      async OauthSystemCodeToAccess(data):Promise<string>{
        var accessToken:string;
        try {
            await axios.post(`https://api.intra.42.fr/oauth/token`, data).then((response) => {
              accessToken = response.data['access_token'];
            })        
        } catch (error) {
          throw new ConflictException(`intraPull failed, problem with OAuth API. input Data out of date`);
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
          throw new ConflictException(`intraPull failed, problem with OAuth API. input Data out of date`);
        }

        console.log(`intraName == ${intraName}`)
        return intraName
      }

      /**
       * 
       * @returns checs if the user exists and returns a boolean
       */
      async checkUserExist(intraName: string):Promise<boolean>{
        const user = await this.userProfileEntityRepos.findOneBy({ intraName })
        if(!user){
          return false
        }
        return true
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
        console.log("I am in login for new account");
        user = this.userProfileEntityRepos.create({
            intraName, username
        });
        //add checks if the account creation fails
        try {
          await this.userProfileEntityRepos.save(user);
        } catch (error) {
            throw new ConflictException(`account name/email "${username} was already in use`);
        }
        const userID = user.id;
        const payload: JwtPayload = { userID };
        const aauthToken: string = this.jwtService.sign(payload);
        return authToken;
      }
}
