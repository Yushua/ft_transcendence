var io = require('socket.io').listen(4242);
var controller = require('./main.controller');
io.sockets.on('connection', controller.respond);
//# sourceMappingURL=server.js.map