import { Injectable } from '@nestjs/common';
import { Task } from './task.model';
@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    //how to take them

    getAllTasks(): Task[] {
        return this.tasks;
    }
}
