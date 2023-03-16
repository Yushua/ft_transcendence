import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';

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
          //exemption
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
          //exemption
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
          var eMail:string = ""
          var username:string = ""
          user = this.userProfileEntityRepos.create({
              intraName, username, eMail
          });
          //add checks if the account creation fails
          await this.userProfileEntityRepos.save(user);
          return ""
        }
        //so now created, and use it to log in

        return authToken
      }
    //   async createUser(authCredentialsDto: AuthCredentialsDto): Promise<UserProfile> {
        
    //     const salt = await bcrypt.genSalt();
    //     // const hashedPassword = await bcrypt.hash(password, salt);
    //     var eMail:string = ""
    //     const _user = this.userProfileEntityRepos.create({
    //         intraName, username, status: UserStatus.CREATION, eMail
    //     });
    //     try {
    //         await this.userProfileEntityRepos.save(_user);
    //     } catch (error) {
    //         console.log(`error "${error.code}`);
    //         if (error.code === '23505'){
    //             throw new ConflictException(`account name/email "${username} was already in use1`);
    //         }
    //         else {
    //             throw new InternalServerErrorException(`account name/email "${error.code} was already in use, but the error is different`);
    //         }
    //     }
    //     return _user;
    // }
}
