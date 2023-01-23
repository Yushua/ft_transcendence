import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.model";
import { Task } from "./task.entity";
export declare class TasksRepository {
    private readonly taskEntityRepository;
    constructor(taskEntityRepository: Repository<Task>);
    findById(id: string): Promise<Task>;
    insert(createTaskDto: CreateTaskDto): Promise<Task>;
    deleteTasksById(id: string): Promise<void>;
    patchTaskById(id: string, status: TaskStatus): Promise<Task>;
    findAll(filterDto: getTasksFilterDto): Promise<Task[]>;
}
