import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

//the root, Module is always the root
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
