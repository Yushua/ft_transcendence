import { Injectable } from '@nestjs/common'
import { UserProfile } from 'src/user-profile/user.entity'
import { GameData } from './components/GameData'
import { IDs } from './utils/gateway.controller'
import { PongStats } from 'src/game-stats/pong-stats.entity'
import { GameStatsService } from 'src/game-stats/game-stats.service'
import { UserProfileService } from '../user-profile/user-profile.service'
import { AddAchievement } from 'src/user-profile/dto/addAchievement.dto'

@Injectable()
export class PongService {
	constructor() {
		PongService._instance = this
	}
	private static _instance: PongService | null = null
	static GetInstance(): PongService | null {
	  return this._instance
	}

	/* On game end update database */
	async postPongStats(gameIDs:string[], gameData:GameData) {

		if (gameData.p1_score === gameData.p2_score)
			console.log("both scored eleven, talk to bas")

		/* get users */ 
		const user1:UserProfile = await UserProfileService.GetInstance()?.findUserBy(gameIDs[IDs.p1_userID])
		const user2:UserProfile = await UserProfileService.GetInstance()?.findUserBy(gameIDs[IDs.p2_userID])

		/* stats vs yourself don't count */
		// if (user1 === user2) {
		// 	//achievement?
		// 	return ;
		// }

		/* set game stats and update users */
		let stat = new PongStats
		if (gameData.gameState === 'p1_won')
			this.updateStatsAndUsers(user1, gameData.p1_score, user2, gameData.p2_score, stat, gameData)
		else
			this.updateStatsAndUsers(user2, gameData.p2_score, user1, gameData.p1_score, stat, gameData)
	}

	async updateStatsAndUsers(winner:UserProfile, winnerScore:number, loser:UserProfile, loserScore:number, stat:PongStats, gameData:GameData) {
		stat.nameGame = "Pong_Classic"
		if (!gameData.isClassic)
			stat.nameGame = "Pong_Custom"
		stat.winner = winner.username
		stat.winner_id = winner.id
		stat.scoreWinner = winnerScore
		stat.loser = loser.username
		stat.loser_id = loser.id
		stat.scoreLoser = loserScore
		winner.wins += 1
		winner.pong_wins += 1
		winner.pong_experience += (100 - (gameData.p2_score * 2))
		winner.experience += (100 - (gameData.p2_score * 2))
		
		loser.losses += 1
		loser.pong_losses += 1
		loser.pong_experience += (gameData.p2_score * 2)
		loser.experience += (gameData.p2_score * 2)
		stat.timeOfGame = Math.floor(gameData.endTime - gameData.beginTime)
		
		/* format: day-month-year, hours:minutes:seconds */
		/* cut off seconds */
		stat.timeStamp = new Date(gameData.beginTime * 1000).toLocaleString('en-GB', { timeZone: 'CET' })
		stat.timeStamp = stat.timeStamp.substring(0, stat.timeStamp.length - 3)

		/* achievements */
		if (winner.wins == 1) {
			let AddAchievement:AddAchievement = {
				nameAchievement: "Now you are a winner!",
				pictureLink: "https://i.imgur.com/APko8Vd.png",
				message: "you won your first game, congratz!"
			}
			UserProfileService.GetInstance()?.postAchievementList(winner.id, AddAchievement)
		}
		if (winner.wins == 10) {
			let AddAchievement:AddAchievement = {
				nameAchievement: "Now you are a winner times ten!",
				pictureLink: "https://i.imgur.com/phxrhIM.png",
				message: "you won your tenth game, congratz!"
			}
			UserProfileService.GetInstance()?.postAchievementList(winner.id, AddAchievement)
		}
		if (stat.scoreLoser == 0) {
			let AddAchievement:AddAchievement = {
				nameAchievement: "Superb Showing",
				pictureLink: "https://i.imgur.com/cPo6NQ4.png",
				message: "you played a perfect game, congratz!"
			}
			UserProfileService.GetInstance()?.postAchievementList(winner.id, AddAchievement)
		}

		/* save updated profiles and the game */
		await UserProfileService.GetInstance()?.updateUserProfiles([winner, loser])
		await GameStatsService.GetInstance()?.insertPongStats(stat)

		/* link stats to user */
		await GameStatsService.GetInstance()?.LinkPongStats(stat.id, winner.id, loser.id)
		
	}
}