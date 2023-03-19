import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
    constructor(
        private TwoFactorAuthServices: TwoFactorAuthService,
    ) {}

}
