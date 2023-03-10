
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
    
    async validate(req: Request, payload: JwtPayload): Promise<UserProfile> {
        const { userID } = payload;
        const id = userID
        //got some reaosn the payload is not updated. still it gets the user??? an old user?
        //how?
        const user: UserProfile = await this.autEntityRepos.findOneBy({ id });
        console.log(user)

        if (!user){
            throw new UnauthorizedException();
        }
        req["user"] = user
        return user;
    }

}
