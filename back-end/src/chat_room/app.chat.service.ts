import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRoomService {
  
  static num: number = 5;
  
  getPage(): string {
    return `<button type="button" onclick="loadPage('chat/next')">Increase</button> ${ChatRoomService.num.toString()}`;
  }
}
