import { GameService } from './game.service';
import { GameRoom } from './components/game_room';
import { GameRoomDTO } from './dto/game_room.dto';
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    createGame(room: GameRoomDTO): Promise<GameRoom>;
    startGame(id: string): Promise<void>;
    clickSquare(num: string): Promise<void>;
    displayIndex(): string;
}
