"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const transform_inteceptor_1 = require("./transform.inteceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe);
    app.useGlobalInterceptors(new transform_inteceptor_1.TransformInterceptor());
    await app.listen(5353);
}
bootstrap();
//# sourceMappingURL=main.js.map