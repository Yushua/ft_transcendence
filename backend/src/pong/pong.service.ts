import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserProfileGameStats } from 'src/user-profile/entity.user_stats_relation'
import { UserProfile } from 'src/user-profile/user.entity'
import { Repository } from 'typeorm'
import { GameData } from './components/GameData'
import { GameStats } from './pong.entity.gamestats'
import { IDs } from './utils/gateway.controller'

@Injectable()
export class PongService {
	constructor(
		@InjectRepository(GameStats)
		private readonly gameRepo: Repository<GameStats>,
		@InjectRepository(UserProfileGameStats)
		private readonly userProfile_gameStats: Repository<UserProfileGameStats>,	
		@InjectRepository(UserProfile)
		private readonly UserRepo: Repository<UserProfile>
	) { 
		PongService._userRepo = this.UserRepo
		PongService._gameRepo = this.gameRepo
		PongService._joinedRepo = this.userProfile_gameStats

	}
		
	private static _userRepo: Repository<UserProfile>
	private static _gameRepo: Repository<GameStats>
	private static _joinedRepo: Repository<UserProfileGameStats>

	async findAll(): Promise<GameStats[]> {
		return this.gameRepo.find();
	}

	static async postGameStats(game:[string, [GameData, string[]]]) {

		const gameData:GameData = game[1][0]
		const gameIDs:string[] = game[1][1]
		
		const userprofile1:UserProfile = await this._userRepo.findOneBy({id: gameIDs[IDs.p1_userID]})
		const userprofile2:UserProfile = await this._userRepo.findOneBy({id: gameIDs[IDs.p2_userID]})
		const stat = new GameStats
		

		stat.nameGame = "Pong_Classic"
		stat.player1_id = gameIDs[IDs.p1_userID]
		stat.player2_id = gameIDs[IDs.p2_userID]
		if (!gameData.isClassic)
			stat.nameGame = "Pong_Custom"
		if (gameData.gameState === 'p1_won') {
			stat.winner = gameData.p1_name
			stat.loser = gameData.p2_name
			stat.scoreLoser = gameData.p2_score	
		}
		else {
			stat.loser = gameData.p1_name
			stat.winner = gameData.p2_name
			stat.scoreLoser = gameData.p1_score	
		}
		stat.scoreWinner = 11
		stat.timeOfGame = Math.floor(gameData.endTime - gameData.beginTime)
		//exp + update win loss
		// classic vs custom
		await this._gameRepo.save(stat)

		const pair = [{userId: userprofile1.id, gameId: stat.id}]
		const pair2 = [{userId: userprofile2.id, gameId: stat.id}]
		
		this._joinedRepo.save(pair)
		if (pair !== pair2)
			this._joinedRepo.save(pair2)
	}

	
}
