import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
export declare class TasksController {
    private taskServices;
    constructor(taskServices: TasksService);
    getTask(filterDto: getTasksFilterDto): Task[];
    getTaskById(id: string): Task;
    postTask(CreateTaskDto: CreateTaskDto): Task;
    deleteTasksById(id: string): void;
    patchUpdateTaskById(id: string, status: TaskStatus): Task;
}
