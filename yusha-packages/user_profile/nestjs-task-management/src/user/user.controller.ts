import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userServices: UserService) {}
    
    //when its a get request, do this
    @Get()
    getAllUser(){
        return this.userServices.getAllUser();
    }
}
