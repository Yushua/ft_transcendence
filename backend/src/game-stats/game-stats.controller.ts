import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { PongStats } from "./pong-stats.entity";
import { GameStatsService } from "./game-stats.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthGuardEncryption } from "src/auth/auth.guard";


@Controller('gamestats')
export class GameStatsController {
    constructor(private GameStatsServices: GameStatsService) {}
    
    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	@Get("/pongstats/:id")
    async getPongStatsById(
        @Param("id") id: string): Promise<PongStats[]>
    {
        const userPongStats = await this.GameStatsServices.getPongStatsById(id);
        return userPongStats;
    }

    @UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	@Get("/pongstats")
    async getAllPongstats(): Promise<PongStats[]>
    {
        const PongGames = await this.GameStatsServices.getAllPongStats();
        return PongGames;
    }

}
