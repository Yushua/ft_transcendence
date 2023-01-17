import { Task } from './task.model';
import { TasksService } from './tasks.service';
export declare class TasksController {
    private taskServices;
    constructor(taskServices: TasksService);
    getAllTask(): Task[];
}
