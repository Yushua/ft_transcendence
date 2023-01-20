import { Get, Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { TaskStatus } from './task-status.model';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';

//random uuid doesn't work for some reason
@Injectable()
export class TasksService {
		constructor(private taskEntityRepository: TasksRepository) {}

	async getAllTasks(filterDto: getTasksFilterDto): Promise<Task[]> {
		return this.taskEntityRepository.findAll(filterDto);
	}

	async getTaskById(id: string): Promise<Task> {
		return this.taskEntityRepository.findById(id);
	}

	async postTask(CreateTaskDto: CreateTaskDto): Promise<Task> {
		return this.taskEntityRepository.insert(CreateTaskDto);
	}   

	async deleteTask(id: string): Promise<void> {
		return this.taskEntityRepository.deleteTasksById(id);
	}
		
	async patchTaskById(id: string, status: TaskStatus): Promise<Task> {
		return this.taskEntityRepository.patchTaskById(id, status);
	}

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
