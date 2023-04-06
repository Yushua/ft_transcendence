import { Module } from '@nestjs/common';
import { AchievementController } from './achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './achievements.entity';
import { AchievementService } from './achievements.service';
import { UserProfile } from 'src/user-profile/user.entity';
import { UserProfileAchievements } from 'src/relation_entities/user_profile_achievements.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Achievement, UserProfile, UserProfileAchievements])],
	controllers: [AchievementController],
	providers: [AchievementService]

})
export class AchievementsModule {}
