import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserProfile } from 'src/user-profile/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PongService {
	constructor( 
		@InjectRepository(UserProfile) private readonly UserRepo: Repository<UserProfile>,
		) {
			PongService._userRepo = this.UserRepo
		}
	
	private static _userRepo: Repository<UserProfile>
	
	static async updateWinLoss(userWonID: string, userLostID:string) {		
		return Promise.all([
			this._userRepo.findOneBy({id: userWonID})
				.then(winner => {
					winner.wins++
					return this._userRepo.save(winner)
				}),
			this._userRepo.findOneBy({id: userLostID})
				.then(loser => {
					loser.losses++
					return this._userRepo.save(loser)
				}),
		])
	}
}
