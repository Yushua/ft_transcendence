import { User } from "src/auth/user.entity";
import { TaskStatus } from "./task-status.model";
export declare class Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    user: User;
}
