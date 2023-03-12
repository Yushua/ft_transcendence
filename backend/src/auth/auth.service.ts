import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/login/dto/auth-credentials.dto';

@Injectable()
export class AuthService {

      async check():Promise<void>{
        console.log("guard is working")
      }

      async QauthSystem(authCredentialsDto: AuthCredentialsDto):Promise<boolean>{
        return false;
      }
}
