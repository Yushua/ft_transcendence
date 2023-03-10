import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthGuardEncryption implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  constructor(
    private jwtService: JwtService,
  ) {}

  async validateRequest(request: any): Promise<boolean> {
    var tmp: boolean = true;
    console.log("I am in validationrequest")
    /*
      get authentication eky
      crack it with secret
      get the info into an user
      and make sure its saved
    */
   /*
   request holds the entire HTTP. 
   */
    // console.log("request == ", request["rawHeaders:"])
    // const decodedJwtAccessToken: JwtPayload = this.jwtService.decode(signedJwtAccessToken);
    //then get the suer. chekc if the user is there. if so. then store the user in req
    return tmp; 
  }
}
