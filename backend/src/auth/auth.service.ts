import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
        console.log("i am here1")
        try {
            await axios.post(`https://api.intra.42.fr/oauth/token`, data).then((response) => {
              accessToken = response.data['access_token'];
            })
            console.log("i am here2")
        } catch (error) {
          throw new ConflictException(`intraPull failed, problem with OAuth API. input Data out of date`);
        }
        console.log("i am here3")
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
      async checkUserExist(username: string):Promise<boolean>{
        const user = await this.userProfileEntityRepos.findOneBy({ username })
        if(!user){
          throw new NotFoundException(`username "${username}" already in use`);
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
        console.log(`intraname${intraName} username${username}`)
        user = this.userProfileEntityRepos.create({
            intraName, username
        });
        //add checks if the account creation fails
        console.log("i am ehre")
        try {
          await this.userProfileEntityRepos.save(user);
        } catch (error) {
          throw new NotFoundException(`username "${username}" already in use`);
        }
        const userID = user.id;
        const payload: JwtPayload = { userID };
        const aauthToken: string = this.jwtService.sign(payload);
        return authToken;
      }
}
