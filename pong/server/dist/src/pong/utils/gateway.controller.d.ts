import { OnModuleInit } from "@nestjs/common";
import { Server, Socket } from 'socket.io';
export declare class MyGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    handleLFG(client: Socket): void;
    handleEvent(direction: number, client: Socket): void;
    handleSpectator(gameName: string, client: Socket): void;
    handleLeaver(client: Socket): void;
    private interval;
}
