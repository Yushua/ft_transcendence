import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardEncryption implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(payload: any): Promise<boolean> {
    var tmp: boolean = true;
    /*
      get authentication eky
      crack it with secret
      get the info into an user
      and make sure its saved
    */
   console.log("I am in vlaidationrequest")
    return tmp; 
}
}
