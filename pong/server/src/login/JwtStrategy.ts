
import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ExtractJwt, Strategy} from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { Repository } from 'typeorm';
import { UserProfile } from "../user-profile/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserProfile)
        private readonly autEntityRepos: Repository<UserProfile>,
    ) {
        super({
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }
    async validate(payload: JwtPayload): Promise<UserProfile> {
        const { username } = payload;
        const user = await this.autEntityRepos.findOneBy({ username });

        if (!user){
            throw new UnauthorizedException();
        }
        return user;
    }

}