import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authServices: AuthService) {}

    @Post('/signup')
    signUp(
        @Body() authCredentialsDto: AuthCredentialsDto
        ): Promise<void> {
        return this.authServices.createUser(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body() authCredentialsDto: AuthCredentialsDto
        ): Promise<{ accessToken: string}> {
        //frontend will save this token and attach
        //it to every application afterwards
        return this.authServices.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(
        @Req() req
        ) {
        console.log(req);
    }

    // @Get('/:id')
    // getTaskById(@Param('id') id:string): Promise<User> {
    //     return this.authServices.findById(id);
    // }
}
