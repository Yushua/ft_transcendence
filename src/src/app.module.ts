import { Module } from '@nestjs/common';
import { UserProfileModule } from './user-profile/user-profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserProfileModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true, //keeps it in sync
      })],
})
export class AppModule {}
