"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = exports.Paddle = void 0;
class Entity {
    constructor(w, h, x, y, num) {
        this.xVec = 0;
        this.yVec = 0;
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
        this.num = num;
    }
}
class Paddle extends Entity {
    constructor() {
        super(...arguments);
        this.speed = 12;
    }
}
exports.Paddle = Paddle;
class Ball extends Entity {
    constructor(w, h, x, y, num) {
        super(w, h, x, y, num);
        this.speed = 7;
        var randomDirection = Math.floor(Math.random() * 2) + 1;
        if (randomDirection % 2)
            this.xVec = 1;
        else
            this.xVec = -1;
        randomDirection = Math.floor(Math.random() * 2) + 1;
        if (randomDirection % 2)
            this.yVec = 1;
        else
            this.yVec = -1;
    }
}
exports.Ball = Ball;
//# sourceMappingURL=pong_objects.js.map