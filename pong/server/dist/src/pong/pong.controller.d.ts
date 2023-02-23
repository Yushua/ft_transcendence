import { PongService } from './pong.service';
import { PongRoom } from './components/pong_room';
import { GameRoomDTO } from './dto/pong_room.dto';
export declare class PongController {
    private gameService;
    constructor(gameService: PongService);
    createGame(room: GameRoomDTO): Promise<PongRoom>;
    startGame(id: string): Promise<void>;
    clickSquare(num: string): Promise<void>;
}
