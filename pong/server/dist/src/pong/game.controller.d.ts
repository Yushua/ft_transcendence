import { GameService } from './pong.service';
import { GameRoom } from './components/pong_room';
import { GameRoomDTO } from './dto/pong_room.dto';
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    createGame(room: GameRoomDTO): Promise<GameRoom>;
    startGame(id: string): Promise<void>;
    clickSquare(num: string): Promise<void>;
}
