import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { UserTwoFactor } from './user.entity';
import axios from 'axios';

export class TwoFactorAuthService {
    constructor(
        @InjectRepository(UserTwoFactor)
        private readonly UserTwoFactorEntityRepos: Repository<UserTwoFactor>,
        private readonly jwtService: JwtService,
    ) {}

        /**
         * this function checks if the code should be checked
         * @param twoFactorToken 
         * @returns 
         */
        async checkInputbeforeCodeCheck(twoFactorToken:string):Promise<boolean>{
            //getting in ehre means tow factor is enabled
            if (await this.checkToken(twoFactorToken) == true){
                if (await this.getStatus(twoFactorToken) == false){
                    //in here means tw factor Token is corrrectly made
                    //and the status in it is true. which means I don't have to check
                    if (await this.checkSecretCode(twoFactorToken) == true){
                        return true
                    }
                    else
                        return false
                }
                else{
                    //because there is no need to check anymore
                    return true
                }
            }
            else {
                throw new HttpException('TwoFactor Token invalid', HttpStatus.BAD_REQUEST)
            }
        }

        async checkCode(twoFactorToken:string, code: string):Promise<boolean>{
            try {
                if (await this.checkInputbeforeCodeCheck(twoFactorToken) == true){
                    //no need to check/ code is already valid
                    return true
                }
                //check the code. if this fails, send HTTP error
            } catch (error) {
                throw new HttpException(`\n\n error ${error}`, HttpStatus.BAD_REQUEST)
            }
        }

        /**
         * it creates the token, when, on first Login or if no Authoken was made, but enabled was true
         *  or if enabled is updated
         *  create the account with the same secret code.
         * create suer or update the user
         * @param userID 
         * @param twoFactor 
         * @param secretCode
         * @returns 
         */
        async createNewToken(userID: string, twoFactor: boolean, secretCode:string):Promise<string>{
            const payload: JwtPayload= { userID, twoFactor: twoFactor, secretCode };
            const authToken: string = this.jwtService.sign(payload);
            var user:UserTwoFactor = await this.UserTwoFactorEntityRepos.findOneBy({ id:userID })
            if (user){
                user.secretCode = secretCode
                await this.UserTwoFactorEntityRepos.save(user)
            }
            else {
                user = this.UserTwoFactorEntityRepos.create({
                    id:userID, twoFactor, secretCode
                  });
                await this.UserTwoFactorEntityRepos.save(user)
            }
            return authToken;
        }

        /**
         * because of security, ehre I check if the token is correct. if it is
         * then i can proceed
         * @param twoFactorToken 
         * @returns 
         */
        async checkToken(twoFactorToken:string):Promise<boolean>{
            try {
                const intraPull = await axios.get('http://localhost:4242/two-factor-auth/check', {
                  headers: {
                    Authorization: `Bearer ${twoFactorToken}`,
                  }
                }).then((response) => {
                    if (response['result'] == false){
                        return false
                    }
                })
              } catch (error) {
                return false
              }
        }

        /**
         * comapres the secret in the use stored in the backend. and the secret stored in the token
         * if they compare then the token is correct
         * @param twoFactorToken 
         * @returns 
         */
        async checkSecretCode(twoFactorToken:string):Promise<boolean>{
            var UserID:string = await this.getUserID(twoFactorToken)
            const user = await this.UserTwoFactorEntityRepos.findOneBy({ id:UserID })

            if (await this.getSecret(twoFactorToken) == user.secretCode){
                return true
            }
            //the secret in the token is invalid. there has been a breach
            throw new HttpException('here has been an attempted breach, using an invalid token', HttpStatus.BAD_REQUEST)
        }


        async updateToken(twoFactorToken:string, updateStatus: boolean, twoFactorCode: string){
            if (await this.checkToken(twoFactorToken) == true){
                //then proceed to update, token is correct
                //check if the string is correct
                //
            }
            else {
                throw new HttpException('two factor token was invalid', HttpStatus.BAD_REQUEST)
            }
        }
        //all of this has to be done here

        async getStatus(twoFactorToken:string):Promise<boolean>{
            var tokenPayload = this.jwtService.decode(twoFactorToken);
            return tokenPayload["twoFactor"]
        }

        async getSecret(twoFactorToken:string):Promise<string>{
            var tokenPayload = this.jwtService.decode(twoFactorToken);
            return tokenPayload["secretCode"]
        }

        async getUserID(twoFactorToken:string):Promise<string>{
            var tokenPayload = this.jwtService.decode(twoFactorToken);
            return tokenPayload["userID"]
        }

        async getUserIDNotToken(twoFactorToken:string):Promise<boolean>{
            var UserID:string = await this.getUserID(twoFactorToken)
            const user = await this.UserTwoFactorEntityRepos.findOneBy({ id:UserID })
            return user.twoFactor
        }

}
