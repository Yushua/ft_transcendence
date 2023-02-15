export declare enum ChatRoomType {
    Public = 0,
    Private = 1
}
export declare class ChatRoom {
    ID: string;
    OwnerID: string;
    MemberIDs: string[];
    AdminIDs: string[];
    Password: string;
    RoomType: ChatRoomType;
    BlackList: string[];
    MessageGroupDepth: number;
}
