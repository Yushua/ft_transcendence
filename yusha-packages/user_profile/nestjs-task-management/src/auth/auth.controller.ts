import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

    // @Get('/:id')
    // getTaskById(@Param('id') id:string): Promise<User> {
    //     return this.authServices.findById(id);
    // }
}
