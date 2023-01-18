import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    //define properties
    constructor(private taskServices: TasksService) {}
    
    //when its a get request, do this
    //http://localhost:4242/tasks
    @Get()
    getAllTask(): Task[] {
        return this.taskServices.getAllTasks();
    }

    //in params hould correspond to the get input
    //http://localhost:4242/somethingelse
    @Get('/:id')
    getTaskById(@Param('id') id:string): Task {
        return this.taskServices.getTasksById(id);
    }

    @Post()
    postTask(
        @Body() CreateTaskDto: CreateTaskDto
    ): Task {
        //create task -> puts it in array -> then writes that array
        return this.taskServices.postTask(CreateTaskDto);
        // console.log('title: ', title, '.');
        // console.log('description: ', description, '.');
    }

    @Delete('/:id')
    deleteTasksById(@Param('id') id: string): void {
        return this.taskServices.deleteTasksById(id);
    }

    @Patch('/:id/status')
    patchUpdateTaskById(
        @Param('id') id: string,
        @Body('status') status: TaskStatus,
        ): Task {
            return this.taskServices.patchUpdateTaskById(id, status);
    }
}

