import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { AppController } from './app.controller';
import { GatewayModule } from './pong/utils/gateway.module';
import { PFPModule } from './profile-pictures/pfp.module';
import { PongModule } from './pong/pong.module';
import { ConfigModule } from '@nestjs/config';
import { GameStatsModule } from './game-stats/game-stats.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 10,
    }),
    ConfigModule.forRoot(),
    UserProfileModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true, //keeps it in sync
    }),
    AuthModule,
    ChatModule,
    GatewayModule,
    PFPModule,
    PongModule,
    GameStatsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
