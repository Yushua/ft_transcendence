import { Get, Injectable, Param } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

//random uuid doesn't work for some reason
@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    //how to take them
    //http://localhost:4242/tasks
    @Get()
    getAllTasks(): Task[] {
        return this.tasks;
    }

    //find() compares to true or false
    getTasksById(id: string) : Task{
        return this.tasks.find((task) => task.id == id);
    }

    //http://localhost:4242/randomline
    createTask(CreateTaskDto: CreateTaskDto): Task {
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


}
