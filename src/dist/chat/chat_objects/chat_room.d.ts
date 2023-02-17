export declare enum ChatRoomType {
    Public = 0,
    Private = 1
}
export declare class ChatRoom {
    ID: string;
    OwnerID: string;
    Password: string;
    RoomType: ChatRoomType;
    MemberIDs: string[];
    AdminIDs: string[];
    BanIDs: string[];
    MuteIDs: string[];
    MuteDates: string[];
    MessageGroupDepth: number;
}
