import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    private User = [];

    //hwo to tak to them

    getAllUser() {
        return this.User;
    }
}
