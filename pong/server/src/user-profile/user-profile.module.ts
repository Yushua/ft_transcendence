import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';

@Module({imports: [
  //this to communicate with the server, else it wont work
  TypeOrmModule.forFeature([UserProfile]),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService]
})
export class UserProfileModule {}
