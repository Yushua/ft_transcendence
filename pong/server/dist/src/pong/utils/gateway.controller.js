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
exports.MyGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const pong_objects_1 = require("../components/pong_objects");
let queuedclient = undefined;
let n_game_rooms = 0;
let game_name = 'game_0';
let gamedata;
let games = new Map;
let roomIDs = new Array;
let dataIdTuple;
let gameInfo = new Array;
let gameList = new Array;
let findTuple = new Map;
let spectators = new Array;
let updated_games = new Array;
let MyGateway = class MyGateway {
    constructor() {
        this.emit_interval = setInterval(() => {
            games.forEach((data_id_tuple, Client) => {
                this.server.to(Client.id).emit('gamedata', data_id_tuple[0]);
                if (data_id_tuple[0].gameState === 'p1_won' || data_id_tuple[0].gameState === 'p2_won') {
                    games.delete(Client);
                    let index = gameList.indexOf([data_id_tuple[0].gameName, data_id_tuple[1][0], data_id_tuple[1][1]]);
                    gameList.splice(index, 1);
                }
                this.server.emit('gamelist', gameList);
            });
        }, 10);
        this.update_interval = setInterval(() => {
            updated_games = [];
            games.forEach((data_id_tuple, Client) => {
                let index = updated_games.indexOf(data_id_tuple[0].gameName);
                if (index === -1) {
                    data_id_tuple[0].update(data_id_tuple[0].ball.update(data_id_tuple[0].p1, data_id_tuple[0].p2));
                    updated_games.push(data_id_tuple[0].gameName);
                }
            });
        }, 10);
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id, ' connected');
        });
    }
    handleLFG(client) {
        console.log(client.id);
        if (queuedclient === undefined || client === queuedclient) {
            queuedclient = client;
            client.emit('pending');
        }
        else {
            game_name = game_name.replace(n_game_rooms.toString(), (n_game_rooms + 1).toString());
            n_game_rooms++;
            console.log(game_name);
            client.emit('joined');
            queuedclient.emit('joined');
            let client2 = queuedclient;
            queuedclient = undefined;
            gamedata = new pong_objects_1.GameData(n_game_rooms, game_name, client.id, client2.id);
            roomIDs.push(client.id);
            roomIDs.push(client2.id);
            gameInfo.push(game_name);
            gameInfo.push(client.id);
            gameInfo.push(client2.id);
            gameList.push(gameInfo);
            dataIdTuple = [gamedata, roomIDs];
            findTuple.set(game_name, dataIdTuple);
            games.set(client, dataIdTuple);
            games.set(client2, dataIdTuple);
            roomIDs = [];
            gameInfo = [];
        }
    }
    handleEvent(direction, client) {
        let game = games.get(client);
        if (game !== undefined) {
            if (game[1][0] === client.id)
                game[0].p1.update(direction);
            if (game[1][1] === client.id)
                game[0].p2.update(direction);
        }
    }
    handleSpectator(gameName, client) {
        dataIdTuple = findTuple.get(gameName);
        if (dataIdTuple !== undefined) {
            games.set(client, dataIdTuple);
            client.emit('spectating');
        }
    }
    handleDisconnect(client) {
        console.log('client:', client.id, ' disconnected');
        let game = games.get(client);
        if (game !== undefined)
            games.delete(client);
    }
    handleLeaver(client) {
        let game = games.get(client);
        if (game !== undefined)
            games.delete(client);
        this.server.to(client.id).emit('left');
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MyGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('LFG'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MyGateway.prototype, "handleLFG", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('movement'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MyGateway.prototype, "handleEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('spectate'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MyGateway.prototype, "handleSpectator", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('disconnect'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MyGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MyGateway.prototype, "handleLeaver", null);
MyGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000']
        }
    })
], MyGateway);
exports.MyGateway = MyGateway;
//# sourceMappingURL=gateway.controller.js.map