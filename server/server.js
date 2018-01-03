const path = require('path');
const express = require('express');
const http = require('http');

const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;

var server = http.createServer(app); 

var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {  
    console.log('New user connected');


    socket.on('createMessage', (message) => {
        console.log("New message", message);

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    });


    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


server.listen(3000, () => {
    console.log('Server is running on port ', port);

})


