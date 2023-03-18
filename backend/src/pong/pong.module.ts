import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserProfile } from 'src/user-profile/user.entity'
import { PongController } from './pong.controller'
import { PongService } from './pong.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([UserProfile]),
	],
	controllers: [PongController],
	providers: [PongService],
})
export class PongModule {}
