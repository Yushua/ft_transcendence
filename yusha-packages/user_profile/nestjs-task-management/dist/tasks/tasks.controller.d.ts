import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
export declare class TasksController {
    private taskServices;
    constructor(taskServices: TasksService);
    getAllTasks(filterDto: getTasksFilterDto): Promise<Task[]>;
    getTaskById(id: string): Promise<Task>;
    postTask(CreateTaskDto: CreateTaskDto, user: User): Promise<Task>;
    deleteTasksById(id: string): Promise<void>;
    patchTaskById(id: string, updateTaskById: UpdateTaskStatusDto): Promise<Task>;
}
