import { Repository } from 'typeorm';
import { GameBkeMap } from './game.bkeMap.entity';
import { GameEntity } from './game.entity';
export declare class GameService {
    private readonly GameEntityRepos;
    private readonly GameBkeMapRepos;
    constructor(GameEntityRepos: Repository<GameEntity>, GameBkeMapRepos: Repository<GameBkeMap>);
    createGame(gameType: string, user1: string, user2: string, gameName: string): Promise<GameEntity>;
    setupBKE(game: GameEntity): Promise<GameBkeMap>;
    setupPong(game: GameEntity): Promise<void>;
    getGameByID(id: string): Promise<GameEntity>;
    startGame(id: string): Promise<void>;
    clickSquare(num: string): Promise<void>;
}
