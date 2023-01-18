import { Get, Injectable, Param } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';

//random uuid doesn't work for some reason
@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    //how to take them
    @Get()
    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: getTasksFilterDto): Task[] {
        const { status, search} = filterDto;

        let tasks = this.getAllTasks();

        if (status){
            tasks = tasks.filter((task) => task.status === status);
        }

        if (search) {
            tasks = tasks.filter((task) => {
                if (task.title.includes(search) || task.description.includes(search)){
                    return true;
                }
                return false;
            });
        }
        return tasks;
    }
    //find() compares to true or false
    postTask(CreateTaskDto: CreateTaskDto): Task {
        const {
            title,
            description
        } = CreateTaskDto;

        const _task: Task = {
            id: v4(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(_task);
        return _task;
    }
    
    getTasksById(id: string) : Task{
        return this.tasks.find((task) => task.id == id);
    }

    //filter method to delete the task
    deleteTasksById(id: string): void{
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    patchUpdateTaskById(id: string, status: TaskStatus){
        const task = this.getTasksById(id);
        task.status = status;
        return task;
    }


    //http://localhost:4242/randomline
}
