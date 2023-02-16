import { ChatService } from './chat.service';
import { ChatMessage } from './chat_objects/chat_message';
import { ChatRoom } from './chat_objects/chat_room';
import { ChatUser } from './chat_objects/chat_user';
import { ChatMessageDTO } from './dto/chat_message.dto';
import { ChatRoomDTO } from './dto/chat_room.dto';
import { Observable } from 'rxjs';
export declare class ChatController {
    private readonly service;
    constructor(service: ChatService);
    GetChatWebApp(): string;
    GetChatUser(userID: string): Promise<ChatUser>;
    GetChatUserInfo(userID: string, info: string): Promise<ChatUser>;
    GetRoom(roomID: string): Promise<ChatRoom>;
    GetRoomInfo(roomID: string, info: string): Promise<any>;
    GetMessageGroup(roomID: string, index: number): Promise<ChatMessage[]>;
    MakeNewRoom(room: ChatRoomDTO): Promise<ChatRoom>;
    PostNewMessage(roomID: string, msg: ChatMessageDTO): Promise<string>;
    AddUser(roomID: string, userID: string): Promise<void>;
    DeleteRoom(roomID: string): string;
    DeleteUser(userID: string): string;
    NotifyClientOfRoomUpdate(ID: string): Observable<string>;
    GetChatUsers(): Promise<ChatUser[]>;
    GetChatRooms(): Promise<ChatRoom[]>;
    DeleteAll(): string;
}
