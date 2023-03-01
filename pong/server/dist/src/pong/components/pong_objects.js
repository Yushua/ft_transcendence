"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = exports.Paddle = exports.GameData = void 0;
class GameData {
    constructor(num, gamename, p1name, p2name) {
        this.gameState = 'newgame';
        this.p1_score = 0;
        this.p2_score = 0;
        this.gameNum = num;
        this.p1 = new Paddle(12, 1, 1500, 750, 20, 20, 100);
        this.p2 = new Paddle(12, 2, 1500, 750, 20, 20, 100);
        this.ball = new Ball(1, 3, 1500, 750, 20, 20, 20);
        this.gameName = gamename;
        this.p1_name = p1name;
        this.p2_name = p2name;
    }
    update(event) {
        if (event === 'p1_scored') {
            this.p1_score++;
            if (this.p1_score === 2)
                this.gameState = 'p1_won';
        }
        else if (event === 'p2_scored') {
            this.p2_score++;
            if (this.p2_score === 2) {
                this.gameState = 'p2_won';
            }
        }
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
            this.x = this.gameCanvasWidth / 2 - this.width / 2;
            this.y = this.gameCanvasHeight / 2 - this.width / 2;
        }
    }
    draw(context) {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Paddle extends Entity {
    constructor() {
        super(...arguments);
        this.keysPressed = new Map();
    }
    update(direction) {
        if (direction === 1) {
            this.yVec = -1;
            if (this.y <= 20)
                this.yVec = 0;
        }
        else if (direction === -1) {
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
            return 'p2_scored';
        }
        if (this.x + this.height >= this.gameCanvasWidth) {
            this.x = this.gameCanvasWidth / 2 - this.height / 2;
            this.xVec = -1 * this.xVec;
            if (randomDirection % 2)
                this.yVec = 1;
            else
                this.yVec = -1;
            return 'p1_scored';
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
        return '';
    }
}
exports.Ball = Ball;
//# sourceMappingURL=pong_objects.js.map