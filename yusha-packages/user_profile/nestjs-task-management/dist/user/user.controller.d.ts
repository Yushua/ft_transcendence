import { UserService } from './user.service';
export declare class UserController {
    private userServices;
    constructor(userServices: UserService);
    getAllUser(): any[];
}
