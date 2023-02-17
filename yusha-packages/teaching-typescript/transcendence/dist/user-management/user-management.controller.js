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
exports.UserManagementController = void 0;
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("./dto/create-user.dto");
const get_user_filter_dto_1 = require("./dto/get-user-filter.dto");
const update_user_status_dto_1 = require("./dto/update-user-status.dto");
const user_management_service_1 = require("./user-management.service");
let UserManagementController = class UserManagementController {
    constructor(userManagementService) {
        this.userManagementService = userManagementService;
    }
    postUser(createUserDto) {
        return this.userManagementService.insert(createUserDto);
    }
    patchUserIdStatus(id, updateUserStatusDto) {
        const { status } = updateUserStatusDto;
        return this.userManagementService.updateUserStatus(id, status);
    }
    getAllUsers(filterDto) {
        return this.userManagementService.getAllTasks(filterDto);
    }
    getUserById(id) {
        return this.userManagementService.findUserById(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "postUser", null);
__decorate([
    (0, common_1.Patch)('/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_status_dto_1.UpdateUserStatusDto]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "patchUserIdStatus", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_filter_dto_1.getUserFilterDto]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "getUserById", null);
UserManagementController = __decorate([
    (0, common_1.Controller)('user-management'),
    __metadata("design:paramtypes", [user_management_service_1.UserManagementService])
], UserManagementController);
exports.UserManagementController = UserManagementController;
//# sourceMappingURL=user-management.controller.js.map