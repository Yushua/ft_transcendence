"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameApp = void 0;
const fs_1 = require("fs");
class GameApp {
    static displayIndex() { return (0, fs_1.readFileSync)('./game.html').toString(); }
}
exports.GameApp = GameApp;
//# sourceMappingURL=game.app.js.map