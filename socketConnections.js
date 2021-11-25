const socketio = require('socket.io');

module.exports.listen = function (server) {
    var io = socketio.listen(server);

    io.on('connection', (socket) => {
        console.log('welcome -> ' + socket.id);

        socket.on('disconnect', () => {
            console.log('Bye bye -> ' + socket.id);
        });
    });

    return io;
}