import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileModule } from './src/user-profile/user-profile.module';
import { LoginModule } from './src/login/login.module';
import { GameModule } from './src/game/game.module';
import { GatewayModule } from './src/gateway/gateway.module';
import { ChatModule } from 'src/chat/chat.module';

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
    LoginModule,
    GameModule,
    ChatModule,
    GatewayModule],
})
export class AppModule {}
