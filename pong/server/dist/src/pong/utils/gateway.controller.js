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
let game_room = 'game_0';
let p1 = 'p1';
let p2 = 'p2';
let MyGateway = class MyGateway {
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('Connected');
        });
    }
    handleLFG(client) {
        console.log(client.id);
        if (queuedclient === undefined || client === queuedclient) {
            queuedclient = client;
            client.emit('pending');
        }
        else {
            game_room = game_room.replace(n_game_rooms.toString(), (n_game_rooms + 1).toString());
            n_game_rooms++;
            console.log(game_room);
            client.join(game_room);
            queuedclient.join(game_room);
            client.emit('joined', game_room);
            queuedclient.emit('joined', game_room);
            let client2 = queuedclient;
            queuedclient = undefined;
            let gamedata = new pong_objects_1.GameData;
            setInterval(() => {
                this.server.to(client.id).emit('gamedata', gamedata);
                this.server.to(client2.id).emit('gamedata', gamedata);
                gamedata.update();
            });
        }
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
MyGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000']
        }
    })
], MyGateway);
exports.MyGateway = MyGateway;
//# sourceMappingURL=gateway.controller.js.map