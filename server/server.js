require('./config/config.js');

const path = require('path');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const _ = require('lodash');


var { mongoose } = require('./db/mongoose');
const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation.js')
const { Users } = require('./utils/users');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');


var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();



app.use(express.static(publicPath));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/login', async (req, res) => {
    try {

        var user = await User.findUser(req.query.name, req.query.password);
        if (!user) {
            res.send('Invalid username and password, try again');
        }
        res.send('Loggedi n')
    } catch (e) {
        res.status(401).send('Invalid username and password, try again');
    }
})

io.on('connection', (socket) => {
    console.log('New user connected');
    var rooms = [];

    socket.on('signup', (data, callback) => {
        var userData = new User(data);
        userData.save().then((userDoc) => {
            console.log(userDoc);
            users.addUser(socket.id, userDoc.name);
            socket.emit("signed-up", userDoc);

            callback();

        }).catch((err) => {
            console.log(err);
            callback(err);
        });
    });

socket.on('setroom', function(id,room){
    
    var user = users.getUser(socket.id);
    user.room = room; 
    console.log(user);
    
        User.findOneAndUpdate({
        _id: id,
      }, { $set:{room: room} }, { new: true }).then((userDoc)=>{
        //   console.log(userDoc);
          socket.emit('initiate', userDoc);
    }).catch((e)=>{
        console.log(e);
        
    });
});







    rooms = rooms.concat(users.getRooms());
    var usersList = users.getAllUsers();
    io.emit('displayRooms', rooms);
    io.emit('displayUsers', usersList);

    socket.on('join', (user, callback) => {
       console.log('listen to join',user);
       
        socket.join(user.room);
        
        users.removeUser(user.id);
        users.addUser(user.id, user.name, user.room);

        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has joined the chat!`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    });


    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }


    });

    socket.on('disconnect', () => {

        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat !`));
        }

        console.log('Client disconnected');
    });
});


server.listen(3000, () => {
    console.log('Server is running on port ', port);
});