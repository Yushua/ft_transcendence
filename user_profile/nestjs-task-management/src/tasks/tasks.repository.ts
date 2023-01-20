import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm"
import { CreateTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.model";
import { Task } from "./task.entity";

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskEntityRepository: Repository<Task>,
  ) {}
 
  async findById(id: string): Promise<Task> {
    const found = await this.taskEntityRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async insert(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title,
        description,
    } = createTaskDto;
    const task = this.taskEntityRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskEntityRepository.save(task);
    return task;
  }

  async deleteTasksById(id: string): Promise<void> {
    const result = await this.taskEntityRepository.delete(id);
 
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async patchTaskById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findById(id);
 
    task.status = status;
    await this.taskEntityRepository.save(task);
 
    return task;
  }

  async findAll(filterDto: getTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskEntityRepository.createQueryBuilder('task');
 
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

    // async getTasksWithFilters(filterDto: getTasksFilterDto): Promise<Task[]> {
    //     const { status, search} = filterDto;
    //     let tasks = this.findAll();
    // } 
		// getTasksWithFilters(filterDto: getTasksFilterDto): Task[] {
		//     const { status, search} = filterDto;

		//     let tasks = this.getAllTasks();

		//     if (status){
		//         tasks = tasks.filter((task) => task.status === status);
		//     }

		//     if (search) {
		//         tasks = tasks.filter((task) => {
		//             if (task.title.includes(search) || task.description.includes(search)){
		//                 return true;
		//             }
		//             return false;
		//         });
		//     }
		//     return tasks;
		// }

}