import { Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    //define properties
    constructor(private taskServices: TasksService) {}

    @Get('/:id')
    getTaskById(@Param('id') id:string): Promise<Task> {
        return this.taskServices.getTaskById(id);
    }

    @Post()
    postTask(
        @Body() CreateTaskDto: CreateTaskDto
    ): Promise<Task> {
        //create task -> puts it in array -> then writes that array
        return this.taskServices.postTask(CreateTaskDto);
    }

    @Delete('/:id')
    deleteTasksById(@Param('id') id: string): Promise<void> {
        return this.taskServices.deleteTask(id);
    }

    // //when its a get request, do this
    // //http://localhost:4242/tasks
    // @Get()
    // getTask(@Query() filterDto: getTasksFilterDto): Task[] {
    //     //if we have any filters defines, cal taskservices.getTskwithFilters
    //     //otherwise, just get all tasks
    //     if (Object.keys(filterDto).length) {
    //         return this.taskServices.getTasksWithFilters(filterDto);
    //     }
    //     else {
    //         return this.taskServices.getAllTasks();
    //     }
    // }

    // /*now patches and updates ONE thing, but normally you would get a DTO of the app
    // do the things you do to this, this can be one thing, or multiuple, and then Patch it all in one go

    // and if you only need to PATCH oen thing, you create that specific one. but if you do more, you use that
    // specific function in the mutiple Patch function
    // */
    // @Patch('/:id/status')
    // patchTaskById(
    //     @Param('id') id: string,
    //     @Body() UpdateTaskStatusDto: UpdateTaskStatusDto,
    //     ): Task {
    //         const {status} = UpdateTaskStatusDto;
    //         return this.taskServices.patchTaskById(id, status);
    // }
}

