import { UserStatus } from "../user-profile-status.model";
export declare class CreateUserDto {
    username: string;
    password: string;
    eMail: string;
    status: UserStatus;
}
