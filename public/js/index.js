var socket = io();

//listening to events
socket.on('connect', function () {
    console.log('Connected to server');
});
socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

//custom events
socket.on('newMessage', function (newMessage) {
    console.log('New message', newMessage);
});