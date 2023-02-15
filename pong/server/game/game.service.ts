import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameBkeMap } from './game.bkeMap.entity';
import { GameEntity } from './game.entity';

@Injectable()
export class GameService {
	constructor( 
		@InjectRepository(GameEntity) private readonly GameEntityRepos: Repository<GameEntity>,
		@InjectRepository(GameBkeMap) private readonly GameBkeMapRepos: Repository<GameBkeMap>
		) {}

	async	createGame(gameType: string, user1: string, user2: string, gameName: string): Promise<GameEntity> {
    
		const _game = this.GameEntityRepos.create ({
			gameType,
			user1,
			user2,
			gameName
		})
		console.log(_game)
		try 
		{
			await this.GameEntityRepos.save(_game)
		}
		catch(error) 
		{
			console.log(`error ${error.code}`)
		}
		return _game
  	}

	async setupBKE(game: GameEntity): Promise<GameBkeMap> {

		const map = Array[9]
		for ( var i:number = 0; i < 9; i++ ) {
			map[i] = 0
		}
		const _map = this.GameBkeMapRepos.create ({
			map
		})
		return _map
	}

	async setupPong(game: GameEntity) {

	}

	async getGameByID(id: string): Promise<GameEntity> {
    	const game = await this.GameEntityRepos.findOneBy({id});
		if (!game)
		{
			throw new NotFoundException(`Game with ID "${id}" not found`);
		}
		return game
	}

	async startGame(id: string) {
		const game = await this.getGameByID(id)
		if (game.gameType == 'bke')
			this.setupBKE(game)
		if (game.gameType == 'pong')
			this.setupPong(game)
	}

	async	clickSquare(num: string) {

	}
}
