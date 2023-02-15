import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '../user-profile/user.entity';
import { JwtStrategy } from './JwtStrategy';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([UserProfile])],
  controllers: [LoginController],
  providers: [LoginService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class LoginModule {}
