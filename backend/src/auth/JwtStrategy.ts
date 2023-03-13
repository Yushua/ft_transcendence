
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
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        })
    }
    
    async validate(req: Request, payload: JwtPayload): Promise<boolean> {
        // console.log(payload)
        return true;
    }
}
