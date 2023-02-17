import { IsEnum } from "class-validator";
import { UserStatus } from "../user-profile-status.model";

export class UpdateUserStatusDto {
    @IsEnum(UserStatus)
    status: UserStatus;
}
