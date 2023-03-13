import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserProfile } from 'src/user-profile/user.entity'
import { PongRoom } from './components/pong_room'
import { PongController } from './pong.controller'
import { PongService } from './pong.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([PongRoom, UserProfile]),
	],
	controllers: [PongController],
	providers: [PongService],
})
export class PongModule {}
