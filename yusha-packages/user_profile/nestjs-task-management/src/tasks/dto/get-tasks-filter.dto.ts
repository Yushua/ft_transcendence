import { IsEnum, IsOptional, IsString, isString } from "class-validator";
import { TaskStatus } from "../task-status.model";

export class getTasksFilterDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
    @IsOptional()
    @IsString()
    search?: string;
}

