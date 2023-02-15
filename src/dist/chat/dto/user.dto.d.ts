import { ChatRole } from "../chat_objects/chat_user";
export declare class ChatUserDTO {
    ID: string;
    Role: ChatRole;
    BlockedUserIDs: Set<string>;
}
