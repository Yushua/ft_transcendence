
import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ExtractJwt, Strategy} from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { Repository } from 'typeorm';
import { UserProfile } from 'src/user-profile/user.entity';

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
    async validate(req: Request, payload: string): Promise<UserProfile> {
        var id:string = payload
        // const id = userID
        console.log("\n\nVALIDATE ACCESS")
        // console.log('id in validate [' + id + ']')
        // console.log('userId in validate [' + userID + "]")
        console.log('payload ' + payload)
        console.log('id ' + id)
        const user: UserProfile = await this.autEntityRepos.findOneBy({ id });
        // console.log("VALIDATE UPDATED USER")
        // console.log(user)

        if (!user){
            throw new UnauthorizedException();
        }
        req["user"] = user
        console.log("END VALIDATION")
        return user;
    }

}
