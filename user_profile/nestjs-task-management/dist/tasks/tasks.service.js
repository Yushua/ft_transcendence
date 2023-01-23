"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const task_status_model_1 = require("./task-status.model");
const task_entity_1 = require("./task.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let TasksService = class TasksService {
    constructor(taskEntity) {
        this.taskEntity = taskEntity;
    }
    async findAllTasks(filterDto) {
        const { status, search } = filterDto;
        const query = this.taskEntity.createQueryBuilder('task');
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', { search: `%${search}%` });
        }
        const tasks = await query.getMany();
        return tasks;
    }
    async findById(id) {
        const found = await this.taskEntity.findOneBy({ id });
        if (!found) {
            throw new common_1.NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }
    async insert(createTaskDto) {
        const { title, description, } = createTaskDto;
        const task = this.taskEntity.create({
            title,
            description,
            status: task_status_model_1.TaskStatus.OPEN,
        });
        await this.taskEntity.save(task);
        return task;
    }
    async deleteTasksById(id) {
        const result = await this.taskEntity.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Task with ID "${id}" not found`);
        }
    }
    async updateTaskById(id, status) {
        const task = await this.findById(id);
        task.status = status;
        await this.taskEntity.save(task);
        return task;
    }
};
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map