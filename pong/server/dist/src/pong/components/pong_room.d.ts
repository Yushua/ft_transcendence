export declare enum PongRoomType {
    Public = 0,
    Private = 1
}
export declare enum GameType {
    Pong_classic = 0,
    Pong_extra = 1
}
export declare class PongRoom {
    id: string;
    PlayerIDs: string[];
    GameName: string;
    GameType: GameType;
    RoomType: PongRoomType;
}
