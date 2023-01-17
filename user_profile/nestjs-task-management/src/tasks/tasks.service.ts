import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 } from 'uuid';

//random uuid doesn't work for some reason
@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    //how to take them

    getAllTasks(): Task[] {
        // let name_n = v4();
        // console.log(typeof name_n);
        // console.log(typeof v4);
        // console.log(typeof v4);
        // console.log(typeof v4);
        return this.tasks;
    }

    createTask(title: string, description: string): Task {

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
