
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



io.on('connection', (socket) => {
    console.log('New user connected');


    socket.on('signup', (data, callback) => {
        var userData = new User(data);
        userData.save().then((userDoc) => {
            // console.log(userDoc);
            // user = _.pick('userDoc', ["name", "_id"]);
            users.addUser(socket.id, userDoc.name);
            socket.emit("signedUp", userDoc);
            showOnlineUsers(users);
            callback();

        }).catch((err) => {
            console.log(err);
            callback(err);
        });
    });

    socket.on('login', async (data, callback) => {
        try {
            var user = await User.findUser(data.name);
            if (!user) {
                callback('Error! Invalid username or password')
            } else {
                if (data.password === user.password) {
                    let userInObj = users.addUser(user.id, user.name, '', socket.id);
                    socket.emit('loginSuccess', user);
                    showOnlineUsers();
                    showActiveRooms();
                    callback();
                }
                else {
                    callback(`Invalid password. Are you ${user.name}?`);
                }
            }

        } catch (e) {
            callback('Invalid username and password, try again');
        }
    });

    socket.on('setroom', function (id, room) {
        // console.log(room);

        var user = users.getUser(id);
        user.room = room;


        User.findOneAndUpdate({
            _id: id,
        }, { $set: { room: room } }, { new: true }).then((userDoc) => {
            //   console.log(userDoc);
            socket.emit('initiate', userDoc);
        }).catch((e) => {
            console.log(e);
        });
    });
    
    var rooms = [];

    var showOnlineUsers = () => {
       
        console.log("existing users", users);
        var usersList = users.getAllUsers();
        
        // console.log("updateUserList", usersList);

        io.emit('updateUserLists', usersList);
    }


    //should be modified in the future
    var showActiveRooms = ()=>{
        rooms = rooms.concat(users.getRooms());
        if(rooms){
            io.emit('displayRooms', rooms);
            }
    }




    socket.on('join', (user, callback) => {
        // console.log('listen to join', user);

        socket.join(user.room);




        users.removeUser(user.id);
        users.addUser(user.id, user.name, user.room, socket.id);
        showActiveRooms();
        // io.to(user.room).emit('updateUserList', users.getUserList(user.room));
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








// app.get('/login', async (req, res) => {
//     try {

//         var user = await User.findUser(req.query.name, req.query.password);
//         if (!user) {
//             res.send('Invalid username and password, try again');
//         }
//         res.send('Loggedi n')
//     } catch (e) {
//         res.status(401).send('Invalid username and password, try again');
//     }
// });