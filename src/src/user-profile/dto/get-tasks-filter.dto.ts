import { IsEnum, IsOptional, IsString, isString } from "class-validator";
import { UserStatus } from "../user-profile-status.model";

export class getTasksFilterDto {
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
    @IsOptional()
    @IsString()
    search?: string;
}

