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
exports.ChatRoomController = void 0;
const common_1 = require("@nestjs/common");
const app_chat_service_1 = require("./app.chat.service");
let ChatRoomController = class ChatRoomController {
    constructor(chatRoomService) {
        this.chatRoomService = chatRoomService;
    }
    default() {
        return this.chatRoomService.getPage();
    }
    next() {
        app_chat_service_1.ChatRoomService.num += 1;
        return this.default();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ChatRoomController.prototype, "default", null);
__decorate([
    (0, common_1.Get)('next'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ChatRoomController.prototype, "next", null);
ChatRoomController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [app_chat_service_1.ChatRoomService])
], ChatRoomController);
exports.ChatRoomController = ChatRoomController;
//# sourceMappingURL=app.chat.controller.js.map