import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
export declare class TasksController {
    private taskServices;
    constructor(taskServices: TasksService);
    getTask(filterDto: getTasksFilterDto): Task[];
    getTaskById(id: string): Task;
    postTask(CreateTaskDto: CreateTaskDto): Task;
    deleteTasksById(id: string): void;
    patchTaskById(id: string, UpdateTaskStatusDto: UpdateTaskStatusDto): Task;
}
