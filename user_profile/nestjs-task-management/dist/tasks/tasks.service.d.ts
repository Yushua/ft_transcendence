import { TaskStatus } from './task-status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Repository } from 'typeorm';
export declare class TasksService {
    private readonly taskEntity;
    constructor(taskEntity: Repository<Task>);
    findAllTasks(filterDto: getTasksFilterDto): Promise<Task[]>;
    findById(id: string): Promise<Task>;
    insert(createTaskDto: CreateTaskDto): Promise<Task>;
    deleteTasksById(id: string): Promise<void>;
    updateTaskById(id: string, status: TaskStatus): Promise<Task>;
}
