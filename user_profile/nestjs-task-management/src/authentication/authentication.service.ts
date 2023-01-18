import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
    private Authentication = [];

    //hwo to tak to them

    getAllAuthentication() {
        return this.Authentication;
    }
}
