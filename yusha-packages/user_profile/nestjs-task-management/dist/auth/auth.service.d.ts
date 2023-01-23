import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
export declare class AuthService {
    private readonly authEntity;
    constructor(authEntity: Repository<User>);
    createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
}
