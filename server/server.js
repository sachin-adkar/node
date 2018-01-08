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

app.post('/signup', urlencodedParser, async (req, res) => {
    try {
        var body = _.pick(req.body, ['name', 'email', 'password']);
      
        var user = new User(body);
        await user.save();
        res.send('Success');
    } catch (err) {
        if (err.name === 'MongoError') {
            res.send('Email already exists');
           console.log('Already exist');
            
        } else if (err.name === 'ValidationError') {
            // if(err.path === 'name'){
            console.log('Validation Error');

            res.send('Fill all fields correctly');
            // }
            // else if(err.path{} === 'password'){
            //     res.send('Password should be atleast 6 characters');
            // }
        }

    }

});
app.get('/login', async (req, res) => {
    try {

        var user = await User.findUser(req.query.name, req.query.password);
        if (!user) {
            res.send('Invalid username and password, try again');
        }
        
    } catch (e) {
        res.status(401).send('Invalid username and password, try again');
    }
})

io.on('connection', (socket) => {
    console.log('New user connected');
    var rooms = [];
    rooms = rooms.concat(users.getRooms());
    io.emit('displayRooms', rooms);

    socket.on('join', (params, callback) => {
        if (!(isRealString(params.name) && (isRealString(params.room)))) {
            callback('Enter the all fields');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat!`));

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