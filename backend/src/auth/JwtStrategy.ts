
import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ExtractJwt, Strategy} from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserProfile } from 'src/user-profile/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserProfile)
        private readonly autEntityRepos: Repository<UserProfile>,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        })
    }
    
    async validate(req: Request, payload: JwtPayload): Promise<UserProfile> {
        const { userID } = payload;
        const user: UserProfile = await this.autEntityRepos.findOneBy({ id: userID });

        if (!user){
            throw new UnauthorizedException();
        }
        req["user"] = user
        return user;
    }
}

