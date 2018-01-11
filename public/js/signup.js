var id;
var formdata;

window.onload = function () {
    $('#login').hide();
    $('#chat').hide();
};

var showLogin = function () {
    $('#login').show();
    $('#signup').hide();
};

var showSignup = function () {
    $('#signup').show();
    $('#login').hide();
};

var showChatPage = function () {
    $('#signup').hide();
    $('#login').hide();
    $('#chat').show();
    $('#chatRoom').hide();
};

var showChatRoom = function () {
    $('#chatRoom').show();
    $('#createRoom').hide();
}

var passNext = function (user) {
    var div = jQuery('#greet-user');
    div.append(jQuery('<h3></h3>').text('Welcome ' + user + ' !'));
};

jQuery(`#signup-form`).on('submit', function (e) {
    e.preventDefault();

    formdata = {
        name: jQuery('#signupName').val(),
        email: jQuery('#email').val(),
        password: jQuery('#signupPassword').val()
    }
    socket.emit('signup', formdata, function (err) {
        if (err) {
            alert("Name already exists");
        }
    });
});
socket.on('signedUp', function (user) {
    id = user._id;
    console.log(id);
    showChatPage();
    passNext(user.name);
});

jQuery(`#login-form`).on('submit', function (e) {
    e.preventDefault();
    formdata = {
        name: jQuery('#loginName').val(),
        password: jQuery('#loginPassword').val()
    };


    socket.emit('login', formdata, function (err) {
        if (err) {
            alert(err);
        }
    });
});

socket.on('loginSuccess', function (user) {
    id = user._id;
    console.log(id);

    showChatPage();
    passNext(user.name);

});
socket.on('updateUserLists', function (users) {
    var ul = jQuery('<ul></ul>');

    users.forEach(function (user) {
        ul.append(jQuery('<li></li>').text(user));
    });
    jQuery('#displayUsers').html(ul);
});

socket.on('displayRooms', function (rooms) {
    var ul = jQuery('<ul></ul>');
   
        rooms.forEach(function (room) {
            if(room !== ''){
            ul.append(jQuery('<li></li>').text(room));
            }
        });
    

    $('#displayRooms').html(ul);
 
});




jQuery('#join-form').on('submit', function (e) {
    e.preventDefault();
    var room = jQuery('#room').val();
    if (!room) {
        alert('Please create or join a room');
        return;
    }
    // showChatRoom();
    setRoom(room);
});






var setRoom = function (room) {

    console.log(id);

    socket.emit('setroom', id, room);
    socket.on('initiate', function (user) {
        showChatRoom();
        socket.emit('join', user, function (e) {
            if (e) console.log('error');
        });
        socket.on('newMessage', function (message) {
            setMessage(message);
            // scrollToBottom();
        });

    });
}

var setMessage = function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
};

jQuery(`#message-form`).on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});
// var removeRoomForm = function(){
//     $('#centered-form__form').hide();
// }




