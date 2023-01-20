import { TaskStatus } from './task-status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
export declare class TasksService {
    private taskEntityRepository;
    constructor(taskEntityRepository: TasksRepository);
    getAllTasks(filterDto: getTasksFilterDto): Promise<Task[]>;
    getTaskById(id: string): Promise<Task>;
    postTask(CreateTaskDto: CreateTaskDto): Promise<Task>;
    deleteTask(id: string): Promise<void>;
    patchTaskById(id: string, status: TaskStatus): Promise<Task>;
}
