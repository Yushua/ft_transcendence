import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/user-profile/user.entity';
import { PFPEntity } from './pfp.entity';
import { PFPController } from './pfp.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			PFPEntity,
			UserProfile,
		]),
		PassportModule.register({ defaultStrategy: 'jwt'}),
	],
	controllers: [PFPController],
	providers: [JwtService]
})
export class PFPModule {}
