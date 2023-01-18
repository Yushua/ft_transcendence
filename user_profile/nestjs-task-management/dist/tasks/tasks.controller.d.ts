import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TasksController {
    private taskServices;
    constructor(taskServices: TasksService);
    getAllTask(): Task[];
    getTaskById(id: string): Task;
    postTask(CreateTaskDto: CreateTaskDto): Task;
    deleteTasksById(id: string): void;
}
