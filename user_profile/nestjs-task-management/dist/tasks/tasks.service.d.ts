import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TasksService {
    private tasks;
    getAllTasks(): Task[];
    createTask(CreateTaskDto: CreateTaskDto): Task;
    getTasksById(id: string): Task;
    deleteTasksById(id: string): void;
}
