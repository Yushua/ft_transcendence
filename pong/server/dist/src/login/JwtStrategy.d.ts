import { Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Repository } from 'typeorm';
import { UserProfile } from "../user-profile/user.entity";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly autEntityRepos;
    constructor(autEntityRepos: Repository<UserProfile>);
    validate(payload: JwtPayload): Promise<UserProfile>;
}
export {};
