import { Controller, Get, Param } from "@nestjs/common";
import { PongStats } from "./pong-stats.entity";
import { GameStatsService } from "./game-stats.service";


@Controller('gamestats')
export class GameStatsController {
    constructor(private GameStatsServices: GameStatsService) {}
    
	@Get("/:id")
    async getPongStatsById(
        @Param("id") id: string): Promise<PongStats[]>
    {
        const userPongStats = await this.GameStatsServices.getPongStatsById(id);
        return userPongStats;
    }

	@Get("/")
    async getAllAchievements(): Promise<PongStats[]>
    {
        const PongGames = await this.GameStatsServices.getAllPongStats();
        return PongGames;
    }

}
