import { Controller, Get, Param, Patch, Post, Query, Body } from '@nestjs/common'
import { GameService } from './game.service'
import { GameRoom } from './components/game_room'
import { GameRoomDTO } from './dto/game_room.dto';
import { io } from 'socket.io-client'

// import { GameApp } from './game.app'

@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}

    @Post('create-game')
    // createGame( @Body() gameType: string, user1: string, user2: string, RoomType:string, GameName: string, GameType:number ): Promise<GameRoom> {
    createGame( @Body() room: GameRoomDTO ): Promise<GameRoom> {
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

