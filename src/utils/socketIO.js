const { Server } = require('socket.io');

const connectChat = () => {
    const io = new Server({
        cors: {
            origin: "http://localhost:3000"
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.emit('welcome', 'welcome to frutible.');
        socket.broadcast.emit('greeting', 'hello all.')

        socket.on('message', (data) => {
            console.log(data);

            io.to(data.receiver).emit("rec-mag", data.message)
        })
        socket.on('group_message', (group_message) => {
            console.log(group_message)
            socket.join(group_message);
        })

    });

    io.listen(8080);
}

module.exports = connectChat