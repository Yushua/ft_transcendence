import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileModule } from './src/user-profile/user-profile.module';
import { LoginModule } from './src/login/login.module';
import { PongModule } from './src/pong/pong.module';
import { ChatModule } from 'src/chat/chat.module';
import { GatewayModule } from 'src/pong/utils/gateway.module';

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
    ChatModule,
    PongModule,
    GatewayModule,
    ],
})
export class AppModule {}
