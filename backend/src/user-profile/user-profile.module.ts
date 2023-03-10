import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';
import { StatProfile } from './user.stat.entity';

@Module({imports: [
  //this to communicate with the server, else it wont work
  TypeOrmModule.forFeature([UserProfile, StatProfile]),
  PassportModule.register({ defaultStrategy: 'jwt'}),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService, JwtService]
})
export class UserProfileModule {}
