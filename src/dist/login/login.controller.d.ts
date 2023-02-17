import { UserProfile } from 'src/user-profile/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginService } from './login.service';
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    signUp(authCredentialsDto: AuthCredentialsDto): Promise<UserProfile>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
}
