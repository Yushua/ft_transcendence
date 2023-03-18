import { Controller } from '@nestjs/common'
import { PongService } from './pong.service'


@Controller('game')
export class PongController {
    constructor(private gameService: PongService) {}

}
