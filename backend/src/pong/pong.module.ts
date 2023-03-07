import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PongRoom } from './components/pong_room'
import { PongController } from './pong.controller'
import { PongService } from './pong.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([PongRoom]),
	],
	controllers: [PongController],
	providers: [PongService],
})
export class PongModule {}
