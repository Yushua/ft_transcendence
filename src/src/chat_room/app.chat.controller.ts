import { Controller, Get } from '@nestjs/common';
import { ChatRoomService } from './app.chat.service';

@Controller('chat')
export class ChatRoomController {
  
  constructor(private readonly chatRoomService: ChatRoomService) {}
  
  @Get()
  default(): string {
    return this.chatRoomService.getPage();
  }
  
  @Get('next')
  next(): string {
    ChatRoomService.num += 1;
    return this.default();
  }
  
}
