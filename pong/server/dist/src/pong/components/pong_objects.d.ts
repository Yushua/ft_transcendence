declare class Entity {
    width: number;
    height: number;
    x: number;
    y: number;
    xVec: number;
    yVec: number;
    num: number;
    constructor(w: number, h: number, x: number, y: number, num: number);
}
export declare class Paddle extends Entity {
    private speed;
}
export declare class Ball extends Entity {
    private speed;
    constructor(w: number, h: number, x: number, y: number, num: number);
}
export {};
