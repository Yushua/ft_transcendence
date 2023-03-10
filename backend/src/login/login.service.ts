import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'
import { UserProfile } from 'src/user-profile/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { JwtModule, JwtService } from '@nestjs/jwt';
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
        console.log(_user);
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

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user_:UserProfile }> {
        const {username, password} = authCredentialsDto;
        const user_= await this.userProfileEntityRepos.findOneBy({ username });

        if (user_&& (await bcrypt.compare(password, user_.password))) {
            const userID = user_.id;
            const payload: JwtPayload = { userID };
            const accessToken: string = this.jwtService.sign(payload);
            
            return {accessToken, user_};
        }
        else {
            throw new UnauthorizedException('Please check your login credentials');
        }

    }

}
