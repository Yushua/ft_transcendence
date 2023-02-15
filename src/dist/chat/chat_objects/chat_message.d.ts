export declare class ChatMessageGroupManager {
    ID: string;
    MessageCount: number;
    OwnerIDs: string[];
    Messages: string[];
    GetMessage(index: number): ChatMessage;
    AddMessage(message: ChatMessage): boolean;
    ToMessages(): ChatMessage[];
    static readonly MaxMessageCount: number;
}
export declare class ChatMessage {
    OwnerID: string;
    Message: string;
    constructor(OwnerID: string, Message: string);
}
