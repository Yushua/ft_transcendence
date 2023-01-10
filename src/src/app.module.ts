import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ChatRoomController } from './chat_room/app.chat.controller';
import { ChatRoomService } from './chat_room/app.chat.service';

@Module({
  controllers: [AppController, ChatRoomController],
  providers: [AppService, ChatRoomService],
})
export class AppModule {}
