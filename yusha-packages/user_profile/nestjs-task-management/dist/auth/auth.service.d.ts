import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly autEntityRepos;
    private jwtService;
    constructor(autEntityRepos: Repository<User>, jwtService: JwtService);
    createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
}
