import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatMessageGroupManager } from './chat_entities/chat_message';
import { ChatRoom, ChatRoomPassword } from './chat_entities/chat_room';
import { ChatUser } from './chat_entities/chat_user';
import { UserProfile } from 'src/user-profile/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([
		ChatRoom,
		ChatRoomPassword,
		ChatMessageGroupManager,
		ChatUser,
		UserProfile
	])],
	controllers: [ChatController],
	providers: [ChatService]
})
export class ChatModule {}
