import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameBkeMap } from './game.bkeMap.entity';
import { GameController } from './game.controller';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([GameBkeMap]),
		TypeOrmModule.forFeature([GameEntity])],
	controllers: [GameController],
	providers: [GameService],
})
export class GameModule {}
