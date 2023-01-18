import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    //define properties
    constructor(private taskServices: TasksService) {}
    
    //when its a get request, do this
    @Get()
    getAllTask(): Task[] {
        return this.taskServices.getAllTasks();
    }

    @Post()
    createTask(
        @Body() CreateTaskDto: CreateTaskDto
    ): Task {
        //create task -> puts it in array -> then writes that array
        return this.taskServices.createTask(CreateTaskDto);
        // console.log('title: ', title, '.');
        // console.log('description: ', description, '.');
    }
}

