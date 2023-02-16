import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameBkeMap } from './game.bkeMap.entity';
import { GameRoom, GameType, GameRoomType } from './components/game_room'

@Injectable()
export class GameService {
	constructor( 
		@InjectRepository(GameRoom) private readonly GameRoomRepos: Repository<GameRoom>,
		@InjectRepository(GameBkeMap) private readonly GameBkeMapRepos: Repository<GameBkeMap>
		) {}

	async	createGame(PlayerIDs: string[], GameName: string, GameType: GameType, GameRoomType:	GameRoomType): Promise<GameRoom> {
    
		const _game = this.GameRoomRepos.create ({
			PlayerIDs,
			GameName,
			GameType,
			GameRoomType,
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

	async setupBKE(game: GameRoom): Promise<GameBkeMap> {

		let map!: Array<number>

		for ( var i:number = 0; i < 9; i++ ) {
			map[i] = 0
		}
		const _map = this.GameBkeMapRepos.create ({
			map
		})
		return _map
	}

	async setupPong(game: GameRoom) {

	}

	async getGameByID(id: string): Promise<GameRoom> {
    	const game = await this.GameRoomRepos.findOneBy({id});
		if (!game)
		{
			throw new NotFoundException(`Game with ID "${id}" not found`);
		}
		return game
	}

	async startGame(id: string) {
		const game = await this.getGameByID(id)
		if (game.GameType === )
			this.setupBKE(game)
		if (game.gameType === 'pong')
			this.setupPong(game)
	}

	async	clickSquare(num: string) {

	}
}