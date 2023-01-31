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
exports.UserManagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const user_status_model_1 = require("./user-status.model");
let UserManagementService = class UserManagementService {
    constructor(userEntity) {
        this.userEntity = userEntity;
    }
    async insert(createUserDto) {
        const { name, password, } = createUserDto;
        const _user = this.userEntity.create({
            name,
            password,
            status: user_status_model_1.UserStatus.OPEN,
        });
        await this.userEntity.save(_user);
        return _user;
    }
    async findUserById(id) {
        const _user = await this.userEntity.findOneBy({ id });
        if (!_user) {
            throw new common_1.NotFoundException(`Task with ID "${id}" not found`);
        }
        return _user;
    }
    async updateUserStatus(id, status) {
        const _user = await this.findUserById(id);
        _user.status = status;
        await this.userEntity.save(_user);
        return _user;
    }
    async getAllTasks(filterDto) {
        const { status, search } = filterDto;
        const query = this.userEntity.createQueryBuilder('task');
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', { search: `%${search}%` });
        }
        const _user = await query.getMany();
        return _user;
    }
};
UserManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserManagementService);
exports.UserManagementService = UserManagementService;
//# sourceMappingURL=user-management.service.js.map