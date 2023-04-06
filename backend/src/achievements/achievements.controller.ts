import { Controller, Get, Param } from "@nestjs/common";
import { AchievementService } from "./achievements.service";
import { Achievement } from "./achievements.entity";


@Controller('achievements')
export class AchievementController {
    constructor(private achievementServices: AchievementService) {}
    

	@Get("/:id")
    async getAchievementsById(
        @Param("id") id: string): Promise<Achievement[]>
    {
        const userAchievements = await this.achievementServices.getAchievementsById(id);
        return userAchievements;
    }

	@Get("/")
    async getAllAchievements(): Promise<Achievement[]>
    {
        const achievements = await this.achievementServices.getAllAchievements();
        return achievements;
    }

}
