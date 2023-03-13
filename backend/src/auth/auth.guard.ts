import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from './jwt-payload.interface';
import { Headers } from '@nestjs/common';
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

/*
    acording to the http request, we're sending a user. which is the Yusha user if you log in at first...
    that shou... not be there?
*/
  async validateRequest(request: Request): Promise<boolean> {
    var tmp: boolean = true
    console.log("I am in validationrequest")
    // console.log(request)
    console.log(typeof(request))
    var keys = Object.keys(request)
    var tmpObject: object = request['rawHeaders']
    console.log(request.headers.get("Authorization"))
    // console.log("rawHeaders", request["rawHeaders"])
    console.log("rawHeaders", tmpObject)
    console.log("request authentication [" + keys + ']')
    /*
      get authentication eky
      crack it with secret
      get the info into an user
      and make sure its saved
    */
   /*
   request holds the entire HTTP. 
   */
    // const decodedJwtAccessToken: JwtPayload = this.jwtService.decode(signedJwtAccessToken);
    //then get the suer. chekc if the user is there. if so. then store the user in req
    return tmp; 
  }
}
