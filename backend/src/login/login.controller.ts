import { Body, Controller, Post } from '@nestjs/common';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor( private loginService: LoginService ) {}

    @Post('/signup')
    signUp(
        @Body() authCredentialsDto: AuthCredentialsDto
        ): Promise<UserProfile> {
        return this.loginService.createUser(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body() authCredentialsDto: AuthCredentialsDto
        ): Promise<{ accessToken: string, userID:string}> {
        //frontend will save this token and attach
        //it to every application afterwards
        return this.loginService.signIn(authCredentialsDto);
    }
}
