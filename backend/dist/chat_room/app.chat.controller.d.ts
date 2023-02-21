import { ChatRoomService } from './app.chat.service';
export declare class ChatRoomController {
    private readonly chatRoomService;
    constructor(chatRoomService: ChatRoomService);
    default(): string;
    next(): string;
}
