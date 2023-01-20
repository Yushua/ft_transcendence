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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const tasks_repository_1 = require("./tasks.repository");
let TasksService = class TasksService {
    constructor(taskEntityRepository) {
        this.taskEntityRepository = taskEntityRepository;
    }
    async getAllTasks(filterDto) {
        return this.taskEntityRepository.findAll(filterDto);
    }
    async getTaskById(id) {
        return this.taskEntityRepository.findById(id);
    }
    async postTask(CreateTaskDto) {
        return this.taskEntityRepository.insert(CreateTaskDto);
    }
    async deleteTask(id) {
        return this.taskEntityRepository.deleteTasksById(id);
    }
    async patchTaskById(id, status) {
        return this.taskEntityRepository.patchTaskById(id, status);
    }
};
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tasks_repository_1.TasksRepository])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map