import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserProfileGameStats } from 'src/user-profile/entity.user_stats_relation'
import { UserProfile } from 'src/user-profile/user.entity'
import { PongController } from './pong.controller'
import { GameStats } from './pong.entity.gamestats'
import { PongService } from './pong.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([UserProfile, GameStats, UserProfileGameStats]),
	],
	controllers: [PongController],
	providers: [PongService],
})
export class PongModule {}
