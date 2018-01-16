var id;
var formdata;
var chatData;

window.onload = function () {
    $('#login').hide();
    $('#chat').hide();
};

var showLogin = function () {
    $('#signup').hide();
    $('#login').show();
};

var showSignup = function () {
    $('#login').hide();
    $('#signup').show();
};

var showChatPage = function () {
    $('#signup').hide();
    $('#login').hide();
    $('#chat').show();
    $('#chatRoom').hide();
    $('#privateChatRoom').hide();
};

var showChatRoom = function () {
    $('#chatRoom').show();
    $('#createRoom').hide();
    $('#privateChatRoom').hide();
}

var showPrivateChatRoom = function () {
    $('#chatRoom').hide();
    $('#createRoom').hide();
    $('#privateChatRoom').show();
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
    // console.log(id);
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
    // console.log(id);

    showChatPage();
    passNext(user.name);

});
socket.on('updateUserLists', function (users) {
  
    var ul = jQuery('<ul></ul>');
    // console.log(formdata.name);

    users.forEach(function (user) {


        if (user !== formdata.name) {
            ul.append(jQuery('<li></li>').text(user));
        }
    });
    jQuery('#displayUsers').html(ul);
});

var reciever;
$('#displayUsers, #chats').on('click', 'li', function () {
    $('#chatRoom').show();
    $('#createRoom').hide();
    $('#groupChatRoom').hide();
    $("#chatRoom").load("chat.html"); 

    reciever = $(this).text();
    socket.emit('createPrivateChat', $(this).text())
    // showPrivateChatRoom();
});

var chatList = [];
jQuery(`#message-form`).on('submit', function (e) {
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');
    console.log('from form', messageTextbox.val());
    
    socket.emit('createPrivateMessage', {
        text: messageTextbox.val()
    }, reciever, function () {
        messageTextbox.val('');
    });

});

socket.on('notifyUser', function (name) {
    var ul= jQuery('<ul></ul>');

    if(chatList.indexOf(name) === -1 ){    
        chatList.push(name);
    }
        chatList.forEach(function(user){
        ul.append(jQuery('<li></li>').text(user));
        });
    $('#chats').html(ul);
});

socket.on('newPrivateMessage', function (message) {
    console.log('Listening',message);
    setMessage(message);
    // scrollToBottom();
});





jQuery('#join-form').on('submit', function (e) {
    e.preventDefault();
    var room = jQuery('#room').val();
    if (!room) {
        alert('Please create or join a room');
        return;
    }
    // showChatRoom();
    $('#chatRoom').hide();
    $('#groupChatRoom').show();
    $('#groupChatRoom').load('group-chat.html');
    setRoom(room);
});

var setRoom = function (room) {
    socket.emit('setroom', id, room);
    socket.on('initiate', function (user) {
        showChatRoom();
        socket.emit('join', user, function (e) {
            if (e) console.log('error');
        });
        socket.on('newMessage', function (message) {
            setGroupMessage(message);
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

var setGroupMessage = function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#group-message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#group-messages').append(html);
};

jQuery(`#group-message-form`).on('submit', function (e) {
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});



socket.on('displayRooms', function (rooms) {
    var ul = jQuery('<ul></ul>');

    rooms.forEach(function (room) {
        if (room !== '') {
            ul.append(jQuery('<li></li>').text(room));
        }
    });
    $('#displayRooms').html(ul);
});
