"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatApp = void 0;
const fs_1 = require("fs");
class ChatApp {
    static GetWebApp() { return (0, fs_1.readFileSync)('./src/chat/webapp.html').toString(); }
}
exports.ChatApp = ChatApp;
//# sourceMappingURL=chat.app.js.map