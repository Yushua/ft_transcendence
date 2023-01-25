import { IsEnum, IsOptional, IsString, isString } from "class-validator";
import { TaskStatus } from "../user-profile-status.model";

export class getTasksFilterDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
    @IsOptional()
    @IsString()
    search?: string;
}

