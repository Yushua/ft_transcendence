import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
export declare class TasksController {
    private taskServices;
    constructor(taskServices: TasksService);
    getTaskById(id: string): Promise<Task>;
    postTask(CreateTaskDto: CreateTaskDto): Promise<Task>;
    deleteTasksById(id: string): Promise<void>;
}
