import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from './jwt-payload.interface';
import { Headers } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from 'src/user-profile/user.entity';
import { REQUEST } from '@nestjs/core';
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
	
	async validateRequest(inMsg: IncomingMessage): Promise<boolean> {
		
		try {
			var token = this.jwtService.decode(inMsg.headers["authorization"].substring(7));
			
			var user = await this.autEntityRepos.findOneBy({id: token["userID"]})
		} catch (error) {
			return false
		}
		
		inMsg["user"] = user
		
		return true; 
	}
}
