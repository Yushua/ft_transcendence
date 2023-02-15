import { ChatMessage } from "./chat_message";
export declare class ChatMessageGroup {
    ID: string;
    Content: ChatMessage[];
    static readonly MaxMessageCount: number;
}
