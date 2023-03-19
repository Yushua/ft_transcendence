import { Module } from '@nestjs/common';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTwoFactor } from './userTwoFactor.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './JwtStrategy';
import { UserTwoFactorEntityRepository } from './two-factor-auth.repository';

@Module({
  imports: [
  PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret51TwoFactor',
      signOptions: {
        expiresIn: '1w',
      },
    }),
    TypeOrmModule.forFeature([UserTwoFactor])],
    providers: [TwoFactorAuthService, JwtStrategy],
    controllers: [TwoFactorAuthController],
  exports: [JwtStrategy, PassportModule, TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
