import { User } from './user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { Repository } from 'typeorm';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly autEntityRepos;
    constructor(autEntityRepos: Repository<User>);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
