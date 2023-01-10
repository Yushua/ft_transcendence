import { Module } from '@nestjs/common';
import { AppController, AppController2 } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [AppController, AppController2],
  providers: [AppService],
})
export class AppModule {}
