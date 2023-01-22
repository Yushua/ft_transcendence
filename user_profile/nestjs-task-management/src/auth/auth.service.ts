import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly authEntity: Repository<User>,
    ) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        
        const { username, password
        } = authCredentialsDto;

        const _user = this.authEntity.create({
            username, password,
        });
        try {
            await this.authEntity.save(_user);
        } catch (error) {
            if (error.code === '23505'){
                throw new ConflictException(`account name "${username} was already in use`);
            }
            else {
                throw new InternalServerErrorException(`account name "${username} was already in use`);
            }
            //how to get the error.code
            //console.log(error.code);
        }
    }
}
