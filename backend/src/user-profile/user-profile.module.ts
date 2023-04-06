import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';
import { PongStats } from 'src/game-stats/pong-stats.entity';

@Module({imports: [
  //this to communicate with the server, else it wont work
  TypeOrmModule.forFeature([UserProfile, PongStats]),
  PassportModule.register({ defaultStrategy: 'jwt'}),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService, JwtService]
})
export class UserProfileModule {}
