import { CanActivate, ConfigurableModuleBuilder, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IncomingMessage } from 'http';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from 'src/user-profile/user.entity';
@Injectable()
export class AuthGuardEncryption implements CanActivate {
	
	constructor(
		private jwtService: JwtService,
		@InjectRepository(UserProfile)
				private readonly autEntityRepos: Repository<UserProfile>,
	) { }
	
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		
		return this.validateRequest(request);
	}
	
	async GetUser(key: string): Promise<UserProfile> {
		var token = this.jwtService.decode(key.substring(key.indexOf(' ') + 1));
		return this.autEntityRepos.findOneBy({id: token["userID"]})
	}
	
	async validateRequest(inMsg: IncomingMessage): Promise<boolean> {
		
		try {
			var authHeader = inMsg.headers["authorization"];
			if (!authHeader)
				throw "wat?"
			var user = await this.GetUser(authHeader)
		} catch (error) {
			return false
		}
		
		inMsg["user"] = user
		
		return true; 
	}
}
