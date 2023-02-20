import React from 'react';
export declare class Pong extends React.Component {
    private gameCanvas;
    private gameContext;
    static keysPressed: Map<string, boolean>;
    static gameState: Map<string, boolean>;
    static playerScore: number;
    static player_2_Score: number;
    private player1;
    private player2;
    private ball;
    constructor();
    drawBoardDetails(): void;
    update(): void;
    draw(): void;
    gameLoop(): void;
}
