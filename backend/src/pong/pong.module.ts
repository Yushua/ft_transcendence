import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserProfile } from 'src/user-profile/user.entity'
import { PongService } from './pong.service'
import { PongStats } from 'src/game-stats/pong-stats.entity'
import { UserProfileModule } from 'src/user-profile/user-profile.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([UserProfile, PongStats]),
		UserProfileModule
	],
	providers: [PongService],
})
export class PongModule {}
