import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
export declare class TasksService {
    private readonly taskEntity;
    constructor(taskEntity: Repository<Task>);
    findById(id: string): Promise<Task>;
    insert(createTaskDto: CreateTaskDto): Promise<Task>;
    deleteTasksById(id: string): Promise<void>;
}
