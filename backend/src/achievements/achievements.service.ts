import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Achievement } from "./achievements.entity";
import { Repository } from "typeorm";
import { UserProfile } from "src/user-profile/user.entity";
import { UserProfileAchievements } from "src/relation_entities/user_profile_achievements.entity";


@Injectable()
export class AchievementService {
    constructor(
		@InjectRepository(UserProfile)
        private readonly userProfileRepo: Repository<UserProfile>,
        @InjectRepository(Achievement)
        private readonly achievementRepo: Repository<Achievement>,
		@InjectRepository(UserProfileAchievements)
        private readonly relationRepo: Repository<UserProfileAchievements>,

      ) {
		AchievementService._relationRepo = this.relationRepo
		AchievementService._achievementRepo = this.achievementRepo
	  }
	
	private static _relationRepo: Repository<UserProfileAchievements>
	private static _achievementRepo: Repository<Achievement>

	async onModuleInit() {
		//create achievements
		const achievements = await this.achievementRepo.find()
		if (achievements.length === 0)
		{
			let Achievement_1 = new Achievement
			let Achievement_2 = new Achievement
			let Achievement_3 = new Achievement

			Achievement_1.message = "Congratulations, you won your first game!"
			Achievement_1.name = "first_win"
			Achievement_1.pictureLink = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSviVmsgsxa2tWks1_kvgWn2gzBItEWFXkA&usqp=CAU"

			Achievement_2.message = "You created your own custom game! Well done!"
			Achievement_2.name = "first_custom"
			Achievement_2.pictureLink = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSviVmsgsxa2tWks1_kvgWn2gzBItEWFXkA&usqp=CAU"

			Achievement_3.message = "Congratulations, you won your tenth game!"
			Achievement_3.name = "ten_wins"
			Achievement_3.pictureLink = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSviVmsgsxa2tWks1_kvgWn2gzBItEWFXkA&usqp=CAU"
			
			this.achievementRepo.save(Achievement_1)
			this.achievementRepo.save(Achievement_2)
			this.achievementRepo.save(Achievement_3)
		}
	}

	async getAchievementsById(id: string): Promise<Achievement[]> {
    	const user = await this.userProfileRepo.findOne({
        	select: ["id"],
        	relations: ["userAchievements"],
        	where: {
        		id: id
        	}
    	})
    	if (!user){
    		throw new NotFoundException(`Task with ID "${id}" not found`);
    		}
      	return user.userAchievements;
    }

	async getAllAchievements(): Promise<Achievement[]> {
    	const achievements = await this.achievementRepo.find()
      	if (!achievements){
    		throw new NotFoundException(`Task 'getAllAchievements' not found`);
    	}
      	return achievements;
    }

	static async giveAchievement(achievementName:string, userID:string) {

		const achievement = await this._achievementRepo.findOne({
			select: ["name", "id"],
			where: {
				name: achievementName
			}
		})
		const pair = [{userId: userID, achievementId: achievement.id}]
		this._relationRepo.save(pair)
	}
}
