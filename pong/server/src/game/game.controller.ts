import { Controller, Get, Param, Patch, Post, Query, Body } from '@nestjs/common'
import { GameService } from './game.service'
import { GameRoom } from './components/game_room'

@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}

    @Post('create-game')
    createGame( @Body() gameType: string, user1: string, user2: string, gameName: string ): Promise<GameRoom> {
        return this.gameService.createGame(gameType, user1, user2, gameName);
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
