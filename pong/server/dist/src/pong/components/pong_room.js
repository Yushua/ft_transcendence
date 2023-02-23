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
exports.PongRoom = exports.GameType = exports.PongRoomType = void 0;
const typeorm_1 = require("typeorm");
var PongRoomType;
(function (PongRoomType) {
    PongRoomType[PongRoomType["Public"] = 0] = "Public";
    PongRoomType[PongRoomType["Private"] = 1] = "Private";
})(PongRoomType = exports.PongRoomType || (exports.PongRoomType = {}));
var GameType;
(function (GameType) {
    GameType[GameType["Pong_classic"] = 0] = "Pong_classic";
    GameType[GameType["Pong_extra"] = 1] = "Pong_extra";
})(GameType = exports.GameType || (exports.GameType = {}));
let PongRoom = class PongRoom {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PongRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], PongRoom.prototype, "PlayerIDs", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PongRoom.prototype, "GameName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PongRoom.prototype, "GameType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PongRoom.prototype, "RoomType", void 0);
PongRoom = __decorate([
    (0, typeorm_1.Entity)()
], PongRoom);
exports.PongRoom = PongRoom;
//# sourceMappingURL=pong_room.js.map