import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly authEntity: Repository<User>,
    ) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        
        const { username, password
        } = authCredentialsDto;

        //hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const _user = this.authEntity.create({
            username, password: hashedPassword,
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
