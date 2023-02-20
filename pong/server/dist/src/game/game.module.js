"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const game_room_1 = require("./components/game_room");
const game_bkeMap_entity_1 = require("./game.bkeMap.entity");
const game_controller_1 = require("./game.controller");
const game_service_1 = require("./game.service");
const socket_module_1 = require("./socket/socket.module");
let GameModule = class GameModule {
};
GameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            socket_module_1.SocketModule,
            typeorm_1.TypeOrmModule.forFeature([game_bkeMap_entity_1.GameBkeMap]),
            typeorm_1.TypeOrmModule.forFeature([game_room_1.GameRoom]),
        ],
        controllers: [game_controller_1.GameController],
        providers: [game_service_1.GameService],
    })
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map