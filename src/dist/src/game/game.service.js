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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const game_bkeMap_entity_1 = require("./game.bkeMap.entity");
const game_entity_1 = require("./game.entity");
let GameService = class GameService {
    constructor(GameEntityRepos, GameBkeMapRepos) {
        this.GameEntityRepos = GameEntityRepos;
        this.GameBkeMapRepos = GameBkeMapRepos;
    }
    async createGame(gameType, user1, user2, gameName) {
        const _game = this.GameEntityRepos.create({
            gameType,
            user1,
            user2,
            gameName
        });
        console.log(_game);
        try {
            await this.GameEntityRepos.save(_game);
        }
        catch (error) {
            console.log(`error ${error.code}`);
        }
        return _game;
    }
    async setupBKE(game) {
        const map = Array[9];
        for (var i = 0; i < 9; i++) {
            map[i] = 0;
        }
        const _map = this.GameBkeMapRepos.create({
            map
        });
        return _map;
    }
    async setupPong(game) {
    }
    async getGameByID(id) {
        const game = await this.GameEntityRepos.findOneBy({ id });
        if (!game) {
            throw new common_1.NotFoundException(`Game with ID "${id}" not found`);
        }
        return game;
    }
    async startGame(id) {
        const game = await this.getGameByID(id);
        if (game.gameType == 'bke')
            this.setupBKE(game);
        if (game.gameType == 'pong')
            this.setupPong(game);
    }
    async clickSquare(num) {
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_entity_1.GameEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(game_bkeMap_entity_1.GameBkeMap)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map