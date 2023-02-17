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
exports.ChatRoom = exports.ChatRoomType = void 0;
const typeorm_1 = require("typeorm");
var ChatRoomType;
(function (ChatRoomType) {
    ChatRoomType[ChatRoomType["Public"] = 0] = "Public";
    ChatRoomType[ChatRoomType["Private"] = 1] = "Private";
})(ChatRoomType = exports.ChatRoomType || (exports.ChatRoomType = {}));
let ChatRoom = class ChatRoom {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatRoom.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatRoom.prototype, "OwnerID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatRoom.prototype, "Password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChatRoom.prototype, "RoomType", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], ChatRoom.prototype, "MemberIDs", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], ChatRoom.prototype, "AdminIDs", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], ChatRoom.prototype, "BanIDs", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], ChatRoom.prototype, "MuteIDs", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], ChatRoom.prototype, "MuteDates", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChatRoom.prototype, "MessageGroupDepth", void 0);
ChatRoom = __decorate([
    (0, typeorm_1.Entity)()
], ChatRoom);
exports.ChatRoom = ChatRoom;
//# sourceMappingURL=chat_room.js.map