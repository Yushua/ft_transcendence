import { Module } from '@nestjs/common';
import { MyGateway } from './gateway.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/user-profile/user.entity';
import { AuthGuardEncryption } from 'src/auth/auth.guard';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserProfile,
		]),
		PassportModule.register({ defaultStrategy: 'jwt'}),
	],
	providers: [
		MyGateway,
		JwtService,
		AuthGuardEncryption
	],
})
export class GatewayModule {

}
