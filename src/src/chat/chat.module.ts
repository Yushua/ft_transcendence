import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatMessageGroupManager } from './chat_objects/chat_message';
import { ChatRoom } from './chat_objects/chat_room';
import { ChatUser } from './chat_objects/chat_user';
import { EventEmitter } from 'stream';

@Module({
	imports: [TypeOrmModule.forFeature([
		ChatRoom,
		ChatMessageGroupManager,
		ChatUser
	])],
	controllers: [ChatController],
	providers: [ChatService, EventEmitter]
})
export class ChatModule {}