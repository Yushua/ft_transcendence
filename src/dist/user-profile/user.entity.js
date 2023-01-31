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
exports.UserProfile = void 0;
const typeorm_1 = require("typeorm");
const user_profile_status_model_1 = require("./user-profile-status.model");
const user_stat_entity_1 = require("./user.stat.entity");
let UserProfile = class UserProfile {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserProfile.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "eMail", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserProfile.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((_type) => user_stat_entity_1.StatProfile, stat => stat.user, { eager: true }),
    __metadata("design:type", Array)
], UserProfile.prototype, "stat", void 0);
UserProfile = __decorate([
    (0, typeorm_1.Entity)()
], UserProfile);
exports.UserProfile = UserProfile;
//# sourceMappingURL=user.entity.js.map