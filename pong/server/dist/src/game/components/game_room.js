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
exports.GameRoom = exports.GameType = exports.GameRoomType = void 0;
const typeorm_1 = require("typeorm");
var GameRoomType;
(function (GameRoomType) {
    GameRoomType[GameRoomType["Public"] = 0] = "Public";
    GameRoomType[GameRoomType["Private"] = 1] = "Private";
})(GameRoomType = exports.GameRoomType || (exports.GameRoomType = {}));
var GameType;
(function (GameType) {
    GameType[GameType["Pong_classic"] = 0] = "Pong_classic";
    GameType[GameType["Pong_extra"] = 1] = "Pong_extra";
    GameType[GameType["Tic_tac_toe"] = 2] = "Tic_tac_toe";
})(GameType = exports.GameType || (exports.GameType = {}));
let GameRoom = class GameRoom {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GameRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], GameRoom.prototype, "PlayerIDs", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GameRoom.prototype, "GameName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GameRoom.prototype, "GameType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GameRoom.prototype, "RoomType", void 0);
GameRoom = __decorate([
    (0, typeorm_1.Entity)()
], GameRoom);
exports.GameRoom = GameRoom;
//# sourceMappingURL=game_room.js.map