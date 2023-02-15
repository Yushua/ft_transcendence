import { Repository } from 'typeorm';
import { ChatMessage, ChatMessageGroupManager } from './chat_objects/chat_message';
import { ChatRoom } from './chat_objects/chat_room';
import { ChatUser } from './chat_objects/chat_user';
import { ChatMessageDTO } from './dto/chat_message.dto';
import { ChatRoomDTO } from './dto/chat_room.dto';
export declare class ChatService {
    private readonly chatRoomRepo;
    private readonly chatMessageRepo;
    private readonly chatUserRepo;
    constructor(chatRoomRepo: Repository<ChatRoom>, chatMessageRepo: Repository<ChatMessageGroupManager>, chatUserRepo: Repository<ChatUser>);
    private _getMsgID;
    private _addMessageGroup;
    NewRoom(roomDTO: ChatRoomDTO): Promise<ChatRoom>;
    GetMessages(roomID: string, index: number): Promise<ChatMessage[]>;
    PostNewMessage(roomID: string, msgDTO: ChatMessageDTO): Promise<string>;
    AddUserToRoom(roomID: string, userID: string): Promise<void>;
    GetRoom(roomID: string): Promise<ChatRoom>;
    ModifyRoom(roomID: string, func: (ChatUser: ChatRoom) => void): Promise<ChatRoom>;
    DeleteRoom(roomID: string): Promise<void>;
    GetOrAddUser(userID: string): Promise<ChatUser>;
    ModifyUser(ID: string, func: (ChatUser: ChatUser) => void): Promise<ChatUser>;
    DeleteUser(userID: string): Promise<void>;
    GetAllUsers(): Promise<ChatUser[]>;
    GetAllRooms(): Promise<ChatRoom[]>;
    DeleteAll(): Promise<void>;
}
