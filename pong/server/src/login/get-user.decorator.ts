import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserProfile } from "../user-profile/user.entity";

export const GetUserProfile = createParamDecorator((data, ctx: ExecutionContext): UserProfile => {
    const req = ctx.switchToHttp().getRequest();
    return req.UserProfile;
});