import { Controller, Get, Param, Patch, Post, Query, Body, OnModuleInit } from '@nestjs/common'
import { PongService } from './pong.service'
import { PongRoom } from './components/pong_room'
import { GameRoomDTO } from './dto/pong_room.dto';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'


@Controller('game')
export class PongController {
    constructor(private gameService: PongService) {}

    @Post('create-game')
    // createGame( @Body() gameType: string, user1: string, user2: string, RoomType:string, GameName: string, GameType:number ): Promise<GameRoom> {
    createGame( @Body() room: GameRoomDTO ): Promise<PongRoom> {
        return this.gameService.createGame(room);
    }

    @Get('start-game/:gameid/')
    startGame( @Param('gameid') id: string) {
        return this.gameService.startGame(id)
    }

    @Get('square/:num')
    clickSquare( @Param('num') num: string) {
        return this.gameService.clickSquare(num)
    }
}
