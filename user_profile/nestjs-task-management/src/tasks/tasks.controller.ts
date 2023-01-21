import { Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    //define properties
    constructor(private taskServices: TasksService) {}

    @Get()
    getAllTasks(@Query() filterDto: getTasksFilterDto): Promise<Task[]> {
        return this.taskServices.findAllTasks(filterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string): Promise<Task> {
        return this.taskServices.findById(id);
    }

    @Post()
    postTask(
        @Body() CreateTaskDto: CreateTaskDto
    ): Promise<Task> {
        //create task -> puts it in array -> then writes that array
        return this.taskServices.insert(CreateTaskDto);
    }

    @Delete('/:id')
    deleteTasksById(@Param('id') id: string): Promise<void> {
        return this.taskServices.deleteTasksById(id);
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

    @Patch('/:id/status')
    patchTaskById(
        @Param('id') id: string,
        @Body() updateTaskById: UpdateTaskStatusDto,
        ): Promise<Task> {
            const {status} = updateTaskById;
            return this.taskServices.updateTaskById(id, status);
    }
}

