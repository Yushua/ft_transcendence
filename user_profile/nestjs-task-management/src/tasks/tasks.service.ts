import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as id_n } from 'uuid';

//random uuid doesn't work for some reason
@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    //how to take them

    getAllTasks(): Task[] {
        return this.tasks;
    }

    createTask(title: string, description: string): Task {
        const _task: Task = {
            //name id, make sure ot create a fake one in the future 
            // id: id_s,
            id: '1234',
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(_task);

        return _task;
    }
}
