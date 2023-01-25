import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileModule } from './user-profile/user-profile.module';

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
      })],
})
export class AppModule {}
