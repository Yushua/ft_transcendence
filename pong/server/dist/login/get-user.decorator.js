"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfile = void 0;
const common_1 = require("@nestjs/common");
exports.GetUserProfile = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.UserProfile;
});
//# sourceMappingURL=get-user.decorator.js.map