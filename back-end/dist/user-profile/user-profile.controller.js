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
exports.UserProfileController = void 0;
const common_1 = require("@nestjs/common");
const get_tasks_filter_dto_1 = require("./dto/get-tasks-filter.dto");
const user_profile_status_model_1 = require("./user-profile-status.model");
const user_profile_service_1 = require("./user-profile.service");
let UserProfileController = class UserProfileController {
    constructor(userServices) {
        this.userServices = userServices;
    }
    getAllTasks(filterDto) {
        return this.userServices.findAllUsers(filterDto);
    }
    getUserById(id) {
        return this.userServices.findUserBy(id);
    }
    getUserByUsername(username) {
        return this.userServices.findUserBy(username);
    }
    changeUsername(username, id) {
        return this.userServices.changeUsername(username, id);
    }
    changeStatus(status, id) {
        return this.userServices.changeStatus(status, id);
    }
};
__decorate([
    (0, common_1.Get)('/user'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_tasks_filter_dto_1.getTasksFilterDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAllTasks", null);
__decorate([
    (0, common_1.Get)('/user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('/user/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getUserByUsername", null);
__decorate([
    (0, common_1.Patch)('/username'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "changeUsername", null);
__decorate([
    (0, common_1.Patch)('/status/:status'),
    __param(0, (0, common_1.Param)('status')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "changeStatus", null);
UserProfileController = __decorate([
    (0, common_1.Controller)('user-profile'),
    __metadata("design:paramtypes", [user_profile_service_1.UserProfileService])
], UserProfileController);
exports.UserProfileController = UserProfileController;
//# sourceMappingURL=user-profile.controller.js.map