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

  
  async findAllTasks(filterDto: getTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskEntity.createQueryBuilder('task');
 
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
 
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }
 
    const tasks = await query.getMany();
    return tasks;
  }

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
		
	async updateTaskById(id: string, status: TaskStatus): Promise<Task> {
		const task = await this.findById(id);

    task.status = status;
    //to save in database
    await this.taskEntity.save(task);

    return task;
	}

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
