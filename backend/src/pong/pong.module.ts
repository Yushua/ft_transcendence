import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserProfile } from 'src/user-profile/user.entity'
import { PongService } from './pong.service'
import { PongStats } from 'src/game-stats/pong-stats.entity'
import { UserProfileService } from 'src/user-profile/user-profile.service'
import { UserProfileModule } from 'src/user-profile/user-profile.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([UserProfile, PongStats]),
	],
	providers: [PongService],
})
export class PongModule {}
