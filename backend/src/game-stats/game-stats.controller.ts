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
  
    // @Get("/pongstat_timestamp/:pong_id/:user_id")
    // async getPongStatsTimeStampById(
    //     @Param("pong_id") pong_id: string, @Param("user_id") user_id: string) : Promise<Date>
    // {
    //     const timestamp = await this.GameStatsServices.getPongStatsTimeStampById(pong_id, user_id);
    //     return timestamp;
    // }

}
