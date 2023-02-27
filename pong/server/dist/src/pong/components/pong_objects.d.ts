export declare class GameData {
    gameState: Map<string, boolean>;
    p1_score: number;
    p2_score: number;
    p1: Paddle;
    p2: Paddle;
    ball: Ball;
    gameCanvasWidth: number;
    gameCanvasHeight: number;
    paddleWidth: number;
    paddleHeight: number;
    ballSize: number;
    wallOffset: number;
    constructor();
    update(): void;
}
declare class Entity {
    x: number;
    y: number;
    xVec: number;
    yVec: number;
    speed: number;
    gameCanvasWidth: number;
    gameCanvasHeight: number;
    wallOffset: number;
    width: number;
    height: number;
    constructor(speed: number, type: number, gameCanvasWidth: number, gameCanvasHeight: number, wallOffset: number, width: number, height: number);
}
export declare class Paddle extends Entity {
    keysPressed: Map<string, boolean>;
    update(): void;
}
export declare class Ball extends Entity {
    constructor(speed: number, type: number, gameCanvasWidth: number, gameCanvasHeight: number, wallOffset: number, width: number, height: number);
    update(p1: Paddle, p2: Paddle): void;
}
export {};
