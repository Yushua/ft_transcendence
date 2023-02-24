export declare class GameData {
    static keysPressed: Map<string, boolean>;
    static gameState: Map<string, boolean>;
    static playerScore: number;
    static player_2_Score: number;
    static player1: Paddle;
    static player2: Paddle;
    ball: Ball;
    static gameCanvasWidth: number;
    static gameCanvasHeight: number;
    constructor();
}
declare class Entity {
    width: number;
    height: number;
    x: number;
    y: number;
    xVec: number;
    yVec: number;
    speed: number;
    constructor(w: number, h: number, x: number, y: number, num: number);
}
export declare class Paddle extends Entity {
    update(): void;
}
export declare class Ball extends Entity {
    constructor(w: number, h: number, x: number, y: number, num: number);
    update(): void;
}
export {};
