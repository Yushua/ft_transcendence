import { AuthenticationService } from './authentication.service';
export declare class AuthenticationController {
    private autServices;
    constructor(autServices: AuthenticationService);
    getAllAuthentication(): any[];
}
