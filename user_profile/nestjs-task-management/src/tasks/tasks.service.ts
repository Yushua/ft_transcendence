import { Get, Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { TaskStatus } from './task-status.model';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';

//random uuid doesn't work for some reason
@Injectable()
export class TasksService {
    //now I can access the Task Repository
    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository,
    ){}


    // //how to take them
    // @Get()
    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTasksById(id: string) : Task{
    //     const found = this.tasks.find((task) => task.id == id);
        
    //     if (!found){
    //         throw new NotFoundException(`Task with ID "${id}" not found`);
    //     }
    //     return found;
    // }

    // getTasksWithFilters(filterDto: getTasksFilterDto): Task[] {
    //     const { status, search} = filterDto;

    //     let tasks = this.getAllTasks();

    //     if (status){
    //         tasks = tasks.filter((task) => task.status === status);
    //     }

    //     if (search) {
    //         tasks = tasks.filter((task) => {
    //             if (task.title.includes(search) || task.description.includes(search)){
    //                 return true;
    //             }
    //             return false;
    //         });
    //     }
    //     return tasks;
    // }
    // //find() compares to true or false
    // postTask(CreateTaskDto: CreateTaskDto): Task {
    //     const {
    //         title,
    //         description
    //     } = CreateTaskDto;

    //     const _task: Task = {
    //         id: v4(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     };
    //     this.tasks.push(_task);
    //     return _task;
    // }

    // //filter method to delete the task
    // deleteTasksById(id: string): void{
    //     const found = this.getTasksById(id);
    //     this.tasks = this.tasks.filter((task) => task.id !== id);
    // }

    // patchTaskById(id: string, status: TaskStatus){
    //     const task = this.getTasksById(id);
    //     task.status = status;
    //     return task;
    // }
    //http://localhost:4242/randomline
}
