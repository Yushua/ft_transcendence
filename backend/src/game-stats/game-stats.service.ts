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
		GameStatsService._instance = this
	  }
	
	private static _instance: GameStatsService | null = null
	static GetInstance(): GameStatsService | null {
		return this._instance
	}

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


	async SavePongStats(statsID:string, user1ID:string, user2ID:string) {
		this.relationRepo.save(this.relationRepo.create({userId: user1ID, pongStatsId: statsID}))
		if (user1ID !== user2ID)
			this.relationRepo.save(this.relationRepo.create({userId: user2ID, pongStatsId: statsID}))
	}

	// async getPongStatsTimeStampById(pong_id:string, user_id:string): Promise<Date> {
	// 	const relation = await this.relationRepo.findOne({
    //     	select: ["pongStatsId", "timeStamp", "userId"],
    //     	where: {
    //     		pongStatsId: pong_id,
	// 			userId: user_id
    //     	}
	// 	})
	// 	return relation.timeStamp
	// }
}
