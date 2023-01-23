import { IsEnum } from "class-validator";
import { UserStatus } from "../user-status.module";

export class UpdateStatusDto {

    @IsEnum(UserStatus)
    status: UserStatus;
}