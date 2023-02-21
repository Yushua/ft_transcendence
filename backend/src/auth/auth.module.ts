import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/user-profile/user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([UserProfile])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
