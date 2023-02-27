"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = exports.Paddle = exports.GameData = void 0;
class GameData {
    constructor() {
        this.gameState = new Map();
        this.p1_score = 0;
        this.p2_score = 0;
        this.gameCanvasWidth = 1500;
        this.gameCanvasHeight = 750;
        this.paddleWidth = 20;
        this.paddleHeight = 100;
        this.ballSize = 20;
        this.wallOffset = 20;
        this.gameState.set("newgame", true);
        this.p1 = new Paddle(7, 1, this.gameCanvasWidth, this.gameCanvasHeight, this.wallOffset, this.paddleWidth, this.paddleHeight);
        this.p2 = new Paddle(7, 2, this.gameCanvasWidth, this.gameCanvasHeight, this.wallOffset, this.paddleWidth, this.paddleHeight);
        this.ball = new Ball(1, 3, this.gameCanvasWidth, this.gameCanvasHeight, this.wallOffset, this.ballSize, this.ballSize);
    }
    update() {
        this.p1.update();
        this.p2.update();
        this.ball.update(this.p1, this.p2);
    }
}
exports.GameData = GameData;
class Entity {
    constructor(speed, type, gameCanvasWidth, gameCanvasHeight, wallOffset, width, height) {
        this.xVec = 0;
        this.yVec = 0;
        this.gameCanvasWidth = gameCanvasWidth;
        this.gameCanvasHeight = gameCanvasHeight;
        this.wallOffset = wallOffset;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.y = this.gameCanvasHeight / 2 - this.height / 2;
        this.x = this.wallOffset;
        if (type === 2)
            this.x = this.gameCanvasWidth - (this.wallOffset + this.width);
        if (type === 3) {
            this.x = this.gameCanvasWidth / 2 - this.width / 2,
                this.y = this.gameCanvasHeight / 2 - this.width / 2;
        }
    }
}
class Paddle extends Entity {
    constructor() {
        super(...arguments);
        this.keysPressed = new Map();
    }
    update() {
        if (this.keysPressed.get("ArrowUp")) {
            this.yVec = -1;
            if (this.y <= 20)
                this.yVec = 0;
        }
        else if (this.keysPressed.get("ArrowDown")) {
            this.yVec = 1;
            if (this.y + this.height >= this.gameCanvasHeight - 20)
                this.yVec = 0;
        }
        else
            this.yVec = 0;
        this.y += this.yVec * this.speed;
    }
}
exports.Paddle = Paddle;
class Ball extends Entity {
    constructor(speed, type, gameCanvasWidth, gameCanvasHeight, wallOffset, width, height) {
        super(speed, type, gameCanvasWidth, gameCanvasHeight, wallOffset, width, height);
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
    update(p1, p2) {
        var randomDirection = Math.floor(Math.random() * 2) + 1;
        if (this.y <= 10) {
            this.yVec = 1;
        }
        if (this.y + this.height >= this.gameCanvasHeight - 10) {
            this.yVec = -1;
        }
        if (this.x <= 0) {
            this.x = this.gameCanvasWidth / 2 - this.height / 2;
            this.xVec = -1 * this.xVec;
            if (randomDirection % 2)
                this.yVec = 1;
            else
                this.yVec = -1;
        }
        if (this.x + this.height >= this.gameCanvasWidth) {
            this.x = this.gameCanvasWidth / 2 - this.height / 2;
            this.xVec = -1 * this.xVec;
            if (randomDirection % 2)
                this.yVec = 1;
            else
                this.yVec = -1;
        }
        if (this.x <= p1.x + p1.width) {
            if (this.y >= p1.y && this.y + this.height <= p1.y + p1.height) {
                this.xVec = 1;
                if (this.y > p1.y) {
                    var yvec_amplifier = (this.y - p1.y) / (p1.height / 2);
                    this.yVec = 0.5;
                }
            }
        }
        if (this.x + this.height >= p2.x) {
            if (this.y >= p2.y && this.y + this.height <= p2.y + p2.height)
                this.xVec = -1;
        }
        this.x += this.xVec * this.speed;
        this.y += this.yVec * this.speed;
    }
}
exports.Ball = Ball;
//# sourceMappingURL=pong_objects.js.map