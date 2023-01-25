import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { TaskStatus } from './task-status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

//random uuid doesn't work for some reason
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskEntity: Repository<Task>,
  ) {} 
  
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

	async findBy(id: string): Promise<Task> {
    const found = await this.taskEntity.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async insert(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const {
      title,
      description,
    } = createTaskDto;
    console.log(user);
    const task = this.taskEntity.create({
      user,
      title,
      description,
      status: TaskStatus.CREATION,
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
}
