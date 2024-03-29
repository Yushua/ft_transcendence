import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { authenticator } from 'otplib';
import { AddAchievement } from 'src/user-profile/dto/addAchievement.dto';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { AddMessageDTO } from 'src/user-profile/dto/addMessage.dto';

export class AuthService {
    constructor(
      @InjectRepository(UserProfile)
      private readonly userProfileEntityRepos: Repository<UserProfile>,
      private readonly jwtService: JwtService,
      private readonly userProlfileServices: UserProfileService,
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
        return intraName
      }

      /**
       * 
       * @returns checks if the user exists and returns a boolean
       */
      async usernameUserExist(username: string):Promise<boolean>{
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
          user = this.userProfileEntityRepos.create({ intraName });
          await this.userProfileEntityRepos.save(user)
          await this.setupAchievements(user.id)
        }
        //two factor authentication, but how? if this is true, then log out.
        const payload: JwtPayload = { userID: user.id, twoFactor: false};
        const authToken: string = this.jwtService.sign(payload);
        return authToken;
      }

      /*
          "name", "picture", "message"
          these should tell the player HOW to get them
          while PostAchievement should congratulate them on getting it
      */
    list:string[][] = [
       ["Now you are a winner!", `https://i.imgur.com/LFMQ3tP.jpg`, "Win a game of Pong!"],
       ["setusername", `https://i.imgur.com/LFMQ3tP.jpg`, "you set your username"],
       ["Superb Showing", `https://i.imgur.com/LFMQ3tP.jpg`, "Win a game of Pong 11-0!"],
       ["Now you are a winner times ten!", `https://i.imgur.com/LFMQ3tP.jpg`, "Win 10 games of Pong!"],
       ["Busy Admin", `https://i.imgur.com/LFMQ3tP.jpg`, "Be a chat room admin with at least 10 people."],
       ["You played yourself!", `https://i.imgur.com/LFMQ3tP.jpg`, "Play a game versus yourself!"],

     ]
      // async AllAchievements():Promise<string[][]>{
      //   return this.list
      // }

      async setupAchievements(id:string){
        {/* setup all achievements*/}
        var AddAchievement:AddAchievement
        await Promise.all(
          this.list.map(async (option) => {
            AddAchievement = {
              nameAchievement: option[0],
              pictureLink: option[1],
              message: option[2]}
              await this.userProlfileServices.AddAchievementList(id, AddAchievement)
          }),
        );

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
        }
        catch (error) {
          throw new HttpException(`username ${username} already in use`, HttpStatus.BAD_REQUEST);
        }
        const payload: JwtPayload = { userID: user.id, twoFactor: false};
        try {
         authToken = this.jwtService.sign(payload);          
        }
        catch (error) {
          console.log(error)
          throw new HttpException(`jwtService sign failed`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return authToken;
      }

      async changeUsername(username:string, intraName:string):Promise<boolean>{
        var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ username })
        if (!user){
          var user:UserProfile = await this.userProfileEntityRepos.findOneBy({ intraName })
          user.username = username;
          await this.userProfileEntityRepos.save(user);
          let addMessageOtherUser:AddMessageDTO = {
            status: "ServerMessage", 
            message: `Welcome ${username}, remove messages in inbox by clicking on them`,
            userID: user.id
          }
          await this.userProlfileServices.SetupSendSingleMessage(addMessageOtherUser, user.id)
          let AddAchievement:AddAchievement = {
            nameAchievement: "setusername",
            pictureLink: "pfp/default_pfp.jpg",
            message: "Great job, you set up your account with an username"
          }
          await this.userProlfileServices.postAchievementList(user.id, AddAchievement)
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
        if (!user || (intraName === user.intraName))
          return true
        return false
      }

      /**
       * validating TWT code input from QR
       * @param code 
       * @returns 
       */
      async checkCodeSecret(code:string, secret:string):Promise<boolean>{
        return authenticator.check(code, secret);
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
