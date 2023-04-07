import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfilePongStats } from 'src/relation_entities/user_profile_pong_stats.entity';
import { UserProfile } from 'src/user-profile/user.entity';
import { GameStatsController } from './game-stats.controller';
import { GameStatsService } from './game-stats.service';
import { PongStats } from './pong-stats.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [TypeOrmModule.forFeature([UserProfile, UserProfilePongStats, PongStats]),
	PassportModule.register({ defaultStrategy: 'jwt'}),],
	controllers: [GameStatsController],
	providers: [GameStatsService, JwtService]

})
export class GameStatsModule {}
