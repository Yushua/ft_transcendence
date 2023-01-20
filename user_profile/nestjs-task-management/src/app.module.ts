import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TasksModule,
    UserModule,
    AuthenticationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '172.23.0.2',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true, //keeps it in sync
      })],
})
export class AppModule {}

