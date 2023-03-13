import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'
import { UserProfile } from 'src/user-profile/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from 'src/user-profile/user-profile-status.model';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userProfileEntityRepos: Repository<UserProfile>,
        private jwtService: JwtService,
    ) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<UserProfile> {
        
        const { username, password, eMail } = authCredentialsDto;
        //hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const _user = this.userProfileEntityRepos.create({
            username, password: hashedPassword, eMail, status: UserStatus.CREATION,
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
            const userID = user.id;
            const payload: JwtPayload = { userID };
            const accessToken: string = this.jwtService.sign(payload);
            //only now can we validate
            // console.log("keycode [" + accessToken + ']')
            return {accessToken, userID};
        }
        else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }

}
