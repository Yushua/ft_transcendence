import { GameEntity } from './game.entity';
import { GameService } from './game.service';
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    createGame(gameType: string, user1: string, user2: string, gameName: string): Promise<GameEntity>;
    startGame(id: string): Promise<void>;
    clickSquare(num: string): Promise<void>;
}
