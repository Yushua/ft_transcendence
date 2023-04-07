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

@Module({
  imports: [
    UserProfileModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'team-zero',
      autoLoadEntities: true,
      synchronize: true, //keeps it in sync
      }),
    AuthModule,
    ChatModule,
    GatewayModule,
    PFPModule,
    PongModule,
    ConfigModule.forRoot(),
    GameStatsModule,
  ],
  controllers: [AppController]
})
export class AppModule {}
