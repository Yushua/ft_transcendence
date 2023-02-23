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
exports.PongController = void 0;
const common_1 = require("@nestjs/common");
const pong_service_1 = require("./pong.service");
const pong_room_dto_1 = require("./dto/pong_room.dto");
let PongController = class PongController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    createGame(room) {
        return this.gameService.createGame(room);
    }
    startGame(id) {
        return this.gameService.startGame(id);
    }
    clickSquare(num) {
        return this.gameService.clickSquare(num);
    }
};
__decorate([
    (0, common_1.Post)('create-game'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pong_room_dto_1.GameRoomDTO]),
    __metadata("design:returntype", Promise)
], PongController.prototype, "createGame", null);
__decorate([
    (0, common_1.Get)('start-game/:gameid/'),
    __param(0, (0, common_1.Param)('gameid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PongController.prototype, "startGame", null);
__decorate([
    (0, common_1.Get)('square/:num'),
    __param(0, (0, common_1.Param)('num')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PongController.prototype, "clickSquare", null);
PongController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [pong_service_1.PongService])
], PongController);
exports.PongController = PongController;
//# sourceMappingURL=pong.controller.js.map