
import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ExtractJwt, Strategy} from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly autEntityRepos: Repository<User>,
    ) {
        super({
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }
    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user: User = await this.autEntityRepos.findOneBy({ username});

        if (!user){
            throw new UnauthorizedException();
        }
        return user;
    }

}
