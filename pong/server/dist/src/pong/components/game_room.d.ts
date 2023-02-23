export declare enum GameRoomType {
    Public = 0,
    Private = 1
}
export declare enum GameType {
    Pong_classic = 0,
    Pong_extra = 1,
    Tic_tac_toe = 2
}
export declare class GameRoom {
    id: string;
    PlayerIDs: string[];
    GameName: string;
    GameType: GameType;
    RoomType: GameRoomType;
}
