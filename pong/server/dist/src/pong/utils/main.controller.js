"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports.respond = function (socket) {
    console.log("hallo");
    socket.on('news', function (newsreel) {
        socket.broadcast.emit(newsreel);
    });
};
//# sourceMappingURL=main.controller.js.map