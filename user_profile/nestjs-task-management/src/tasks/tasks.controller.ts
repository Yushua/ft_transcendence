import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
    //define properties
    constructor(private taskServices: TasksService) {}
    
    //when its a get request, do this
    //http://localhost:4242/tasks
    @Get()
    getTask(@Query() filterDto: getTasksFilterDto): Task[] {
        //if we have any filters defines, cal taskservices.getTskwithFilters
        //otherwise, just get all tasks
        if (Object.keys(filterDto).length) {
            return this.taskServices.getTasksWithFilters(filterDto);
        }
        else {
            return this.taskServices.getAllTasks();
        }
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

    /*now patches and updates ONE thing, but normally you would get a DTO of the app
    do the things you do to this, this can be one thing, or multiuple, and then Patch it all in one go

    and if you only need to PATCH oen thing, you create that specific one. but if you do more, you use that
    specific function in the mutiple Patch function
    */
    @Patch('/:id/status')
    patchTaskById(
        @Param('id') id: string,
        @Body() UpdateTaskStatusDto: UpdateTaskStatusDto,
        ): Task {
            const {status} = UpdateTaskStatusDto;
            return this.taskServices.patchTaskById(id, status);
    }


}

