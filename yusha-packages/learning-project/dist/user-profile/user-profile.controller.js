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
const updata_status_dto_1 = require("./dto/updata-status.dto");
const user_profile_credentials_dto_1 = require("./dto/user-profile-credentials.dto");
const user_profile_service_1 = require("./user-profile.service");
const user_status_module_1 = require("./user-status.module");
let UserProfileController = class UserProfileController {
    constructor(userProfileService) {
        this.userProfileService = userProfileService;
    }
    postUserProfile(userProfileCredentialsDto) {
        return this.userProfileService.injectUser(userProfileCredentialsDto);
    }
    getOfflineGive(id, updateStatusDto) {
        const { status } = updateStatusDto;
        return this.userProfileService.updateStatus(id, status);
    }
    getOffline(id) {
        return this.userProfileService.updateStatus(id, user_status_module_1.UserStatus.OFFLINE);
    }
    getOnline(id) {
        return this.userProfileService.updateStatus(id, user_status_module_1.UserStatus.ONLINE);
    }
    getUserProfileById(id) {
        return this.userProfileService.findUserProfileById(id);
    }
    getAllUseProfile() {
        return this.userProfileService.getAll();
    }
};
__decorate([
    (0, common_1.Post)('user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_profile_credentials_dto_1.userProfileCredentialsDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "postUserProfile", null);
__decorate([
    (0, common_1.Post)('/offlineGive/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updata_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getOfflineGive", null);
__decorate([
    (0, common_1.Post)('/offline/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getOffline", null);
__decorate([
    (0, common_1.Post)('/online/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getOnline", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getUserProfileById", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAllUseProfile", null);
UserProfileController = __decorate([
    (0, common_1.Controller)('user-profile'),
    __metadata("design:paramtypes", [user_profile_service_1.UserProfileService])
], UserProfileController);
exports.UserProfileController = UserProfileController;
//# sourceMappingURL=user-profile.controller.js.map