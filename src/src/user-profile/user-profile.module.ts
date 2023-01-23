import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileController } from './user-profile.controller';
import { UserProfile } from './user-profile.entity';
import { UserProfileService } from './user-profile.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserProfile])],
    controllers: [UserProfileController],
    providers: [UserProfileService]})
export class UserProfileModule {
}
