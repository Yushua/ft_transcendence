import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

      async check():Promise<void>{
        console.log("guard is working")
      }
}
