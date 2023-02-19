import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserProfile } from 'src/user-profile/user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class LoginService {
    private readonly userProfileEntityRepos;
    private jwtService;
    constructor(userProfileEntityRepos: Repository<UserProfile>, jwtService: JwtService);
    createUser(authCredentialsDto: AuthCredentialsDto): Promise<UserProfile>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
}
