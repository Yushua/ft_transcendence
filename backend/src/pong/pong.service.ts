import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserProfile } from 'src/user-profile/user.entity'
import { Repository } from 'typeorm'
import { GameData } from './components/GameData'
import { IDs } from './utils/gateway.controller'
import { PongStats } from 'src/game-stats/pong-stats.entity'
import { GameStatsService } from 'src/game-stats/game-stats.service'
import { UserProfileService } from 'src/user-profile/user-profile.service'
import { AddAchievement } from 'src/user-profile/dto/addAchievement.dto'

@Injectable()
export class PongService {
	constructor(
		// @Injects(UserProfileService)
  		// private readonly UserServices: UserProfileService,
		@InjectRepository(PongStats)
		private readonly PongRepo: Repository<PongStats>,
		@InjectRepository(UserProfile)
		private readonly UserRepo: Repository<UserProfile>,
	) { 
		PongService._userRepo = this.UserRepo
		PongService._PongRepo = this.PongRepo

	}
		
	private static _userRepo: Repository<UserProfile>
	private static _PongRepo: Repository<PongStats>

	/* On game end update database */
	static async postPongStats(game:[string, [GameData, string[]]]) {

		const gameData:GameData = game[1][0]
		const gameIDs:string[] = game[1][1]
		
		/* get users */ 
		const user1:UserProfile = await this._userRepo.findOneBy({id: gameIDs[IDs.p1_userID]})
		const user2:UserProfile = await this._userRepo.findOneBy({id: gameIDs[IDs.p2_userID]})
		
		/* set game stats and update users */

		// const achievement = await this.achievEntity.create({
		// 	nameAchievement: nameAchievement,
		// 	pictureLink: pictureLink,
		// 	message: message,
		// 	userProfile: userprofile
		//   });
  
		let stat = new PongStats
		stat.nameGame = "Pong_Classic"
		stat.player1_id = gameIDs[IDs.p1_userID]
		stat.player2_id = gameIDs[IDs.p2_userID]
		if (!gameData.isClassic)
			stat.nameGame = "Pong_Custom"
		if (gameData.gameState === 'p1_won') {
			stat.winner = gameData.p1_name
			stat.loser = gameData.p2_name
			stat.scoreLoser = gameData.p2_score
			user1.wins += 1
			user1.pong_wins += 1
			user1.pong_experience += (100 - (gameData.p2_score * 2))
			user1.experience += (100 - (gameData.p2_score * 2))
			if (user1.wins == 1) {
				var AddAchievement:AddAchievement = {
					nameAchievement: "first_win",
					pictureLink: `aa.com/hoi.jpg`,
					message: `you won your first game, congratz`}
				// await this.UserServices.postAchievementList(user1.id, AddAchievement)
			}
			user2.losses += 1
			user2.pong_losses += 1
			user2.pong_experience += (gameData.p2_score * 2)
			user2.experience += (gameData.p2_score * 2)
		}
		else {
			stat.loser = gameData.p1_name
			stat.winner = gameData.p2_name
			stat.scoreLoser = gameData.p1_score	
			user2.pong_wins += 1
			user2.pong_experience += (100 - (gameData.p1_score * 2))
			user1.pong_losses += 1
			user1.pong_experience += (gameData.p1_score * 2)
		}
		/*	this happened once for unknown reasons, some sync issue mayb? mayb fixed, mayb not, 
			somehow game didnt end in time and let p2 get an extra point after game end */
		if (stat.scoreLoser === 11)
			stat.scoreLoser = 10
		stat.scoreWinner = 11
		stat.timeOfGame = Math.floor(gameData.endTime - gameData.beginTime)

		/* save updated profiles and the game */
		await this._userRepo.save(user1)
		await this._userRepo.save(user2)
		await this._PongRepo.save(stat)
		
		/* link stats to user */
		GameStatsService.savePongStats(stat.id, user1.id, user2.id)
	}
}
