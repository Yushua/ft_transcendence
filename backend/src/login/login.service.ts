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
        
        const { intraName, password } = authCredentialsDto;
        //hash
        var check: boolean = false
        var username:string;
        var value:number = 0;
        while (check == false){
            username = intraName
            const user = await this.userProfileEntityRepos.findOneBy({ username });
            if (user){
                check = true;
            }
            else{
                username = username + `_${value}`
            }
            value++
        }
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        var eMail:string = ""
        const _user = this.userProfileEntityRepos.create({
            intraName, username, password: hashedPassword, status: UserStatus.CREATION, eMail
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
        const { intraName, password } = authCredentialsDto;
        const user = await this.userProfileEntityRepos.findOneBy({ intraName });
        if (user && (await bcrypt.compare(password, user.password))) {
            const userID = user.id;
            const payload: JwtPayload = { userID };
            const accessToken: string = this.jwtService.sign(payload);
            //only now can we validate
            console.log("keycode [" + accessToken + ']')
            return {accessToken, userID};
        }
        else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }

}
