import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfilePongStats } from 'src/relation_entities/user_profile_pong_stats.entity';
import { UserProfile } from 'src/user-profile/user.entity';
import { GameStatsController } from './game-stats.controller';
import { GameStatsService } from './game-stats.service';
import { PongStats } from './pong-stats.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserProfile, UserProfilePongStats, PongStats])],
	controllers: [GameStatsController],
	providers: [GameStatsService]

})
export class GameStatsModule {}
