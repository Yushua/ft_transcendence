import { IsOptional, IsString } from "class-validator";

export class getTasksFilterDto {
    @IsOptional()
    @IsString()
    search?: string;
}

