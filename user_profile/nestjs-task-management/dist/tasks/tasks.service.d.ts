import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
export declare class TasksService {
    private tasks;
    getAllTasks(): Task[];
    getTasksWithFilters(filterDto: getTasksFilterDto): Task[];
    postTask(CreateTaskDto: CreateTaskDto): Task;
    getTasksById(id: string): Task;
    deleteTasksById(id: string): void;
    patchUpdateTaskById(id: string, status: TaskStatus): Task;
}
