import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly autEntityRepos: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        
        const { username, password
        } = authCredentialsDto;

        //hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const _user = this.autEntityRepos.create({
            username, password: hashedPassword,
        });
        try {
            await this.autEntityRepos.save(_user);
        } catch (error) {
            if (error.code === '23505'){
                throw new ConflictException(`account name "${username} was already in use`);
            }
            else {
                throw new InternalServerErrorException(`account name "${username} was already in use`);
            }
            //how to get the error.code
            console.log(error.code);
        }
    }
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string}> {
        const {username, password} = authCredentialsDto;

        const user = await this.autEntityRepos.findOneBy({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            //create account
            const payload: JwtPayload = { username};
            const accessToken: string = await this.jwtService.sign(payload);
            return {accessToken};
        }
        else {
            throw new UnauthorizedException('Please check your login credentials');
        }

    }
}
