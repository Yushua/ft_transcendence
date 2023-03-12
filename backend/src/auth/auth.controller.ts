import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/login/dto/auth-credentials.dto';
import { LoginService } from 'src/login/login.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor( private AuthService: AuthService ) {}

    @Post('/Qauth')
    signUpQauth(@Body() authCredentialsDto: AuthCredentialsDto): Promise<Boolean> {
        
        return this.AuthService.QauthSystem(authCredentialsDto);
    }
}
