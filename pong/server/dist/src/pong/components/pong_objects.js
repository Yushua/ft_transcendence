"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = exports.Paddle = exports.GameData = void 0;
class GameData {
    constructor() {
        GameData.gameCanvasWidth = 1500;
        GameData.gameCanvasHeight = 750;
        GameData.gameState.set("newgame", true);
        var paddleWidth = 20, paddleHeight = 100, ballSize = 20, wallOffset = 20;
        GameData.player1 = new Paddle(paddleWidth, paddleHeight, wallOffset, GameData.gameCanvasHeight / 2 - paddleHeight / 2, 1);
        GameData.player2 = new Paddle(paddleWidth, paddleHeight, GameData.gameCanvasWidth - (wallOffset + paddleWidth), GameData.gameCanvasHeight / 2 - paddleHeight / 2, 2);
        this.ball = new Ball(ballSize, ballSize, GameData.gameCanvasWidth / 2 - ballSize / 2, GameData.gameCanvasHeight / 2 - ballSize / 2, 3);
    }
}
exports.GameData = GameData;
GameData.keysPressed = new Map();
GameData.gameState = new Map();
GameData.playerScore = 0;
GameData.player_2_Score = 0;
class Entity {
    constructor(w, h, x, y, num) {
        this.xVec = 0;
        this.yVec = 0;
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
        this.speed = num;
    }
}
class Paddle extends Entity {
    update() {
        if (GameData.keysPressed.get("ArrowUp")) {
            this.yVec = -1;
            if (this.y <= 20)
                this.yVec = 0;
        }
        else if (GameData.keysPressed.get("ArrowDown")) {
            this.yVec = 1;
            if (this.y + this.height >= GameData.gameCanvasHeight - 20)
                this.yVec = 0;
        }
        else
            this.yVec = 0;
        this.y += this.yVec * this.speed;
    }
}
exports.Paddle = Paddle;
class Ball extends Entity {
    constructor(w, h, x, y, num) {
        super(w, h, x, y, num);
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
    update() {
        var randomDirection = Math.floor(Math.random() * 2) + 1;
        if (this.y <= 10) {
            this.yVec = 1;
        }
        if (this.y + this.height >= GameData.gameCanvasHeight - 10) {
            this.yVec = -1;
        }
        if (this.x <= 0) {
            this.x = GameData.gameCanvasWidth / 2 - this.width / 2;
            this.xVec = -1 * this.xVec;
            if (randomDirection % 2)
                this.yVec = 1;
            else
                this.yVec = -1;
            GameData.player_2_Score += 1;
            if (GameData.player_2_Score === 11) {
                GameData.gameState.set("game_end", true);
                GameData.gameState.set("P2_won", true);
            }
        }
        if (this.x + this.width >= GameData.gameCanvasWidth) {
            this.x = GameData.gameCanvasWidth / 2 - this.width / 2;
            this.xVec = -1 * this.xVec;
            if (randomDirection % 2)
                this.yVec = 1;
            else
                this.yVec = -1;
            GameData.playerScore += 1;
            if (GameData.playerScore === 11) {
                GameData.gameState.set("game_end", true);
                GameData.gameState.set("P1_won", true);
            }
        }
        if (this.x <= GameData.player1.x + GameData.player1.width) {
            if (this.y >= GameData.player1.y && this.y + this.height <= GameData.player1.y + GameData.player1.height) {
                this.xVec = 1;
                if (this.y > GameData.player1.y) {
                    var yvec_amplifier = (this.y - GameData.player1.y) / (GameData.player1.height / 2);
                    this.yVec = 0.5;
                }
            }
        }
        if (this.x + this.width >= GameData.player2.x) {
            if (this.y >= GameData.player2.y && this.y + this.height <= GameData.player2.y + GameData.player2.height)
                this.xVec = -1;
        }
        this.x += this.xVec * this.speed;
        this.y += this.yVec * this.speed;
    }
}
exports.Ball = Ball;
//# sourceMappingURL=pong_objects.js.map