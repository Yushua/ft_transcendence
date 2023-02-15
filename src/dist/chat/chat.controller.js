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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_message_dto_1 = require("./dto/chat_message.dto");
const chat_room_dto_1 = require("./dto/chat_room.dto");
const chat_app_1 = require("./chat.app");
let ChatController = class ChatController {
    constructor(service) {
        this.service = service;
    }
    GetChatWebApp() { return chat_app_1.ChatApp.GetWebApp(); }
    GetChatUser(userID) { return this.service.GetOrAddUser(userID); }
    async GetChatUserInfo(userID, info) { return (await this.service.GetOrAddUser(userID))[info]; }
    GetRoom(roomID) { return this.service.GetRoom(roomID); }
    async GetRoomInfo(roomID, info) { return (await this.service.GetRoom(roomID))[info]; }
    GetMessageGroup(roomID, index) { return this.service.GetMessages(roomID, +index); }
    async MakeNewRoom(room) { return await this.service.NewRoom(room); }
    async PostNewMessage(roomID, msg) { return await this.service.PostNewMessage(roomID, msg); }
    async AddUser(roomID, userID) { await this.service.AddUserToRoom(roomID, userID); }
    DeleteRoom(roomID) { this.service.DeleteRoom(roomID); return "All gone!"; }
    DeleteUser(userID) { this.service.DeleteUser(userID); return "All gone!"; }
    GetChatUsers() { return this.service.GetAllUsers(); }
    GetChatRooms() { return this.service.GetAllRooms(); }
    DeleteAll() { this.service.DeleteAll(); return "All gone!"; }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ChatController.prototype, "GetChatWebApp", null);
__decorate([
    (0, common_1.Get)("user/:userID"),
    __param(0, (0, common_1.Param)("userID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetChatUser", null);
__decorate([
    (0, common_1.Get)("user/:userID/:info"),
    __param(0, (0, common_1.Param)("userID")),
    __param(1, (0, common_1.Param)("info")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetChatUserInfo", null);
__decorate([
    (0, common_1.Get)("room/:roomID"),
    __param(0, (0, common_1.Param)("roomID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetRoom", null);
__decorate([
    (0, common_1.Get)("room/:roomID/:info"),
    __param(0, (0, common_1.Param)("roomID")),
    __param(1, (0, common_1.Param)("info")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetRoomInfo", null);
__decorate([
    (0, common_1.Get)("msg/:roomID/:index"),
    __param(0, (0, common_1.Param)("roomID")),
    __param(1, (0, common_1.Param)("index")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetMessageGroup", null);
__decorate([
    (0, common_1.Post)("room"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_room_dto_1.ChatRoomDTO]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "MakeNewRoom", null);
__decorate([
    (0, common_1.Post)("msg/:roomID"),
    __param(0, (0, common_1.Param)("roomID")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_message_dto_1.ChatMessageDTO]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "PostNewMessage", null);
__decorate([
    (0, common_1.Post)("room/:roomID/:userID"),
    __param(0, (0, common_1.Param)("roomID")),
    __param(1, (0, common_1.Param)("userID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "AddUser", null);
__decorate([
    (0, common_1.Delete)("room/:roomID"),
    __param(0, (0, common_1.Param)("roomID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], ChatController.prototype, "DeleteRoom", null);
__decorate([
    (0, common_1.Delete)("user/:userID"),
    __param(0, (0, common_1.Param)("userID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], ChatController.prototype, "DeleteUser", null);
__decorate([
    (0, common_1.Get)("users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetChatUsers", null);
__decorate([
    (0, common_1.Get)("rooms"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetChatRooms", null);
__decorate([
    (0, common_1.Delete)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ChatController.prototype, "DeleteAll", null);
ChatController = __decorate([
    (0, common_1.Controller)("chat"),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map