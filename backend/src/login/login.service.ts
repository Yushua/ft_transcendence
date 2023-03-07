import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'
import { UserProfile } from 'src/user-profile/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from 'src/user-profile/user-profile-status.model';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userProfileEntityRepos: Repository<UserProfile>,
        private jwtService: JwtService,
    ) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<UserProfile> {
        
        const {
            username,
            password,
            eMail
        } = authCredentialsDto;
        console.log(authCredentialsDto);
        //hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const _user = this.userProfileEntityRepos.create({
            username,
            password: hashedPassword,
            eMail,
            status: UserStatus.CREATION,
        });
        try {
            await this.userProfileEntityRepos.save(_user);
        } catch (error) {
            console.log(`error "${error.code}`);
            if (error.code === '23505'){
                throw new ConflictException(`account name/email "${username} was already in use1`);
            }
            else {
                throw new InternalServerErrorException(`account name/email "${error.code} was already in use, but the error is different`);
            }
        }
        return _user;
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, userID:string }> {
        const {username, password} = authCredentialsDto;

        const user = await this.userProfileEntityRepos.findOneBy({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            //create account
            const userID = user.id;
            const payload: JwtPayload = { username, userID};
            const accessToken: string = await this.jwtService.sign(payload);
            return {accessToken, userID};
        }
        else {
            throw new UnauthorizedException('Please check your login credentials');
        }

    }

    async checkId(id:string):Promise<boolean> {
        const user = await this.userProfileEntityRepos.findOneBy({ id });
        if (!user){
            return false
        }
        return true
    }

    async validateInputEmail(email:string){
         const result = String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        if (!result){
            throw ("email is invalid")
        }
      }

    async validateEmail(username:string, email:string){
        const user = await this.userProfileEntityRepos.findOneBy({ username });
        if (!user){
            throw("user does not exist")
        }
        if (user.eMail != email){
            throw("email does not belong to this user")
        }
    }
}
