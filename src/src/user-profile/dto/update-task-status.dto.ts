import { IsEnum } from "class-validator";
import { TaskStatus } from "../user-profile-status.model";

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus;
}
