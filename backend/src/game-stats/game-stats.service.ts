import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PongStats } from "./pong-stats.entity";
import { Repository } from "typeorm";
import { UserProfile } from "src/user-profile/user.entity";
import { UserProfilePongStats } from "src/relation_entities/user_profile_pong_stats.entity";

@Injectable()
export class GameStatsService {
    constructor(
		@InjectRepository(UserProfile)
        private readonly UserRepo: Repository<UserProfile>,
        @InjectRepository(PongStats)
        private readonly PongRepo: Repository<PongStats>,
		@InjectRepository(UserProfilePongStats)
        private readonly relationRepo: Repository<UserProfilePongStats>
      ) {
		GameStatsService._relationRepo = this.relationRepo
		GameStatsService._pongRepo = this.PongRepo
	  }
	
	private static _relationRepo: Repository<UserProfilePongStats>
	private static _pongRepo: Repository<PongStats>

	async getPongStatsById(id: string): Promise<PongStats[]> {
    	const user = await this.UserRepo.findOne({
        	select: ["id"],
        	relations: ["userStats"],
        	where: {
        		id: id
        	}
    	})
    	if (!user){
    		throw new NotFoundException(`Task with ID "${id}" not found`);
    		}
      	return user.userStats;
    }

	async getAllPongStats(): Promise<PongStats[]> {
    	const games = await this.PongRepo.find()
      	if (!games){
    		throw new NotFoundException(`Task 'getAllAchievements' not found`);
    	}
      	return games;
    }

	static async savePongStats(statsID:string, user1ID:string, user2ID:string) {
		const pair = [{userId: user1ID, pongStatsId: statsID}]
		const pair2 = [{userId: user2ID, pongStatsId: statsID}]
		this._relationRepo.save(pair)
		if (user1ID !== user2ID)
			this._relationRepo.save(pair2)
	}
}
