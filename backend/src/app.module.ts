import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { AppController } from './app.controller';
import { GatewayModule } from './pong/utils/gateway.module';

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
    GatewayModule],
  controllers: [
    AppController
  ]
})
export class AppModule {}
