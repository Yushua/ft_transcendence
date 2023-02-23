import { Repository } from 'typeorm';
import { PongRoom } from './components/pong_room';
import { GameRoomDTO } from './dto/pong_room.dto';
export declare class PongService {
    private readonly GameRoomRepos;
    constructor(GameRoomRepos: Repository<PongRoom>);
    createGame(gameDTO: GameRoomDTO): Promise<PongRoom>;
    setupPong(game: PongRoom): Promise<void>;
    getGameByID(id: string): Promise<PongRoom>;
    startGame(id: string): Promise<void>;
    clickSquare(num: string): Promise<void>;
    displayIndex(): Promise<void>;
}
