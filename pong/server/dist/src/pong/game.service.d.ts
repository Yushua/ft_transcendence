import { Repository } from 'typeorm';
import { GameBkeMap } from './game.bkeMap.entity';
import { GameRoom } from './components/pong_room';
import { GameRoomDTO } from './dto/pong_room.dto';
export declare class GameService {
    private readonly GameRoomRepos;
    private readonly GameBkeMapRepos;
    constructor(GameRoomRepos: Repository<GameRoom>, GameBkeMapRepos: Repository<GameBkeMap>);
    createGame(gameDTO: GameRoomDTO): Promise<GameRoom>;
    setupBKE(game: GameRoom): Promise<GameBkeMap>;
    setupPong(game: GameRoom): Promise<void>;
    getGameByID(id: string): Promise<GameRoom>;
    startGame(id: string): Promise<void>;
    clickSquare(num: string): Promise<void>;
    displayIndex(): Promise<void>;
}
