import { IsEnum, IsOptional, IsString, isString } from "class-validator";

export class getTasksFilterDto {
    @IsOptional()
    @IsString()
    search?: string;
}

