import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserProfile } from "src/user-profile/user.entity";
import { UserTwoFactor } from "./userTwoFactor.entity";

export const GetUserProfile = createParamDecorator((data, ctx: ExecutionContext): UserTwoFactor => {
    const req = ctx.switchToHttp().getRequest();
    return req.UserProfile;
});