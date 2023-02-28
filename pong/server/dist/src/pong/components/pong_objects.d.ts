export declare class GameData {
    gameState: string;
    gameNum: number;
    p1_score: number;
    p2_score: number;
    p1: Paddle;
    p2: Paddle;
    ball: Ball;
    constructor(num: number);
    update(event: string): void;
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
    draw(context: CanvasRenderingContext2D): void;
}
export declare class Paddle extends Entity {
    keysPressed: Map<string, boolean>;
    update(direction: number): void;
}
export declare class Ball extends Entity {
    constructor(speed: number, type: number, gameCanvasWidth: number, gameCanvasHeight: number, wallOffset: number, width: number, height: number);
    update(p1: Paddle, p2: Paddle): "p1_scored" | "p2_scored" | "";
}
export {};
