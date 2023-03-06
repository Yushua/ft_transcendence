import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor( private loginService: LoginService) {}

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
        console.log(authCredentialsDto)
        return this.loginService.signIn(authCredentialsDto);
    }
    @Post('/test')
    @UseGuards(AuthGuard())
    test(){
        console.log("proof")
    }
    @Post('/testId:id')
    // @UseGuards(AuthGuard())
    testId(@Param('id') id:string){
        return this.loginService.checkId(id);
    }
    @Post('/validateEmail/:username/:email')
    // @UseGuards(AuthGuard())
    validateAndEmail(
    @Param('username') username:string,
    @Param('email') email:string){
        return this.loginService.validateEmail(username,email);
    }
}
