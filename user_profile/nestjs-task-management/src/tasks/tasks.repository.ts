import { EntityRepository, Repository } from "typeorm"
import { Task } from "./task.entity";

//how to make a repository
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    
}