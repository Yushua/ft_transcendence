import { OnModuleInit } from "@nestjs/common";
import { Server, Socket } from 'socket.io';
export declare class MyGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    handleLFG(client: Socket): void;
}
