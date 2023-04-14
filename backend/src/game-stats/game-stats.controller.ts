import { Controller, Get, Param } from "@nestjs/common";
import { PongStats } from "./pong-stats.entity";
import { GameStatsService } from "./game-stats.service";


@Controller('gamestats')
export class GameStatsController {
    constructor(private GameStatsServices: GameStatsService) {}
    
	@Get("/pongstats/:id")
    async getPongStatsById(
        @Param("id") id: string): Promise<PongStats[]>
    {
        const userPongStats = await this.GameStatsServices.getPongStatsById(id);
        return userPongStats;
    }

	@Get("/pongstats")
    async getAllPongstats(): Promise<PongStats[]>
    {
        const PongGames = await this.GameStatsServices.getAllPongStats();
        return PongGames;
    }

}
