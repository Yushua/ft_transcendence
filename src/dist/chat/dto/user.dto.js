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
exports.ChatUserDTO = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const chat_user_1 = require("../chat_objects/chat_user");
class ChatUserDTO {
}
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], ChatUserDTO.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsEnum)(chat_user_1.ChatRole),
    __metadata("design:type", Number)
], ChatUserDTO.prototype, "Role", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Set)
], ChatUserDTO.prototype, "BlockedUserIDs", void 0);
exports.ChatUserDTO = ChatUserDTO;
//# sourceMappingURL=user.dto.js.map