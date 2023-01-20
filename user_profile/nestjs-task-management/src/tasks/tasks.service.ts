import { Get, Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { TaskStatus } from './task-status.model';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
// import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

//random uuid doesn't work for some reason
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskEntity: Repository<Task>,
  ) {}

	// async getAllTasks(filterDto: getTasksFilterDto): Promise<Task[]> {
	// 	// return this.taskEntityRepository.findAll(filterDto);
	// }

	async findById(id: string): Promise<Task> {
    const found = await this.taskEntity.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async insert(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title,
        description,
    } = createTaskDto;
    const task = this.taskEntity.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskEntity.save(task);
    return task;
  }

  async deleteTasksById(id: string): Promise<void> {
    const result = await this.taskEntity.delete(id);
 
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
		
	// async patchTaskById(id: string, status: TaskStatus): Promise<Task> {
	// 	return this.taskEntityRepository.patchTaskById(id, status);
	// }

		// async getTasksWithFilters(filterDto: getTasksFilterDto): Promise <Task[]> {
		// 	return this.taskEntityRepository.getTasksWithFilters(id, status);
		// }
	
		// //find() compares to true or false
		//createTask
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
}
