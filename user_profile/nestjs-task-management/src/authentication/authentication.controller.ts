import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
    constructor(private autServices: AuthenticationService) {}
    
    //when its a get request, do this
    @Get()
    getAllAuthentication(){
        return this.autServices.getAllAuthentication();
    }
}
