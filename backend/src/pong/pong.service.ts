import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserProfile } from 'src/user-profile/user.entity'
import { Repository } from 'typeorm'
import { PongRoom } from './components/pong_room'
import { GameRoomDTO } from './dto/pong_room.dto'
import { UserProfileModule } from '../user-profile/user-profile.module';

@Injectable()
export class PongService {
	constructor( 
		@InjectRepository(PongRoom) private readonly GameRoomRepos: Repository<PongRoom>,
		@InjectRepository(PongRoom) private readonly UserRepo: Repository<UserProfile>,
		) { PongService._userRepo = UserRepo }

	static async stopGame(userWonID: string) {
		var user = await this._userRepo.findOneBy({id: userWonID})
		await this._userRepo.save(user);
	}

	private static _userRepo: Repository<UserProfile>
	
	// async	createGame(PlayerIDs: string[], GameName: string, GameType: GameType, GameRoomType:	GameRoomType): Promise<GameRoom> {
    async	createGame(gameDTO: GameRoomDTO): Promise<PongRoom> {

		const { PlayerIDs, RoomType, GameName, GameType } = gameDTO
		const _game = this.GameRoomRepos.create ({
			PlayerIDs,
			RoomType,
			GameName,
			GameType,
		})
		console.log(_game)
		try 
		{
			await this.GameRoomRepos.save(_game)
		}
		catch(error:any) 
		{
			console.log(`error ${error.code}`)
		}
		return _game
  	}

	async setupPong(game: PongRoom) {

	}

	async getGameByID(id: string): Promise<PongRoom> {
    	const game = await this.GameRoomRepos.findOneBy({id});
		if (!game)
		{
			throw new NotFoundException(`Game with ID "${id}" not found`);
		}
		return game
	}

	async startGame(id: string) {
		const game = await this.getGameByID(id)
		if (game.GameType === 0)
			this.setupPong(game)
	}

	async	clickSquare(num: string) {

	}

	async displayIndex() {
		
	}
}
