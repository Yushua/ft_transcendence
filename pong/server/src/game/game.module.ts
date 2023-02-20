import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GameRoom } from './components/game_room'
import { GameBkeMap } from './game.bkeMap.entity'
import { GameController } from './game.controller'
import { GameService } from './game.service'
import { SocketModule } from './socket/socket.module'

@Module({
	imports: [
		SocketModule,
		TypeOrmModule.forFeature([GameBkeMap]),
		TypeOrmModule.forFeature([GameRoom]),
	],
	controllers: [GameController],
	providers: [GameService],
})
export class GameModule {}
