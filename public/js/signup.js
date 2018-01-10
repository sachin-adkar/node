
var id;

jQuery(`#signup-form`).on('submit', function (e) {
    e.preventDefault();
    var data = {
        name: jQuery('#name').val(),
        email: jQuery('#email').val(),
        password: jQuery('#password').val()
    }
    socket.emit('signup', data, function (err) {
        if (err) {
            alert("Name already exists");
        }

    });
    socket.on('signed-up', function (user) {
        id = user._id;
        console.log(user);
        //make display:none for signup page
        $('#centered-form__form').hide();
        passNext(user);
    });
});
var passNext = function (user) {

    $('#centered-form').load("next.html", function () {
        var div = jQuery('#greet-user');
        div.append(jQuery('<h3></h3>').text('Welcome ' + user.name + ' !'));
    });

    //   socket.on('displayRooms', function (rooms) {

    //     var template = jQuery('#active-room').html();
    //     console.log(rooms);
    //    rooms.forEach(function (room) {
    //         jQuery('#select').append(jQuery('<option></option>').text(room));
    //     });
    // });  
}
// var id = userDoc._id;
var setRoom = function (room, flag) {
    console.log(room);
    console.log(id);


    socket.emit('setroom', id, room);

    socket.on('initiate', function (user) {
        removeRoomForm();


        $('#centered-form').load("chat.html", function () {
            alert('added chat page');
        });
        socket.emit('join', user, function (e) {
            if (e) console.log('error');

        });
        socket.on('newMessage', function (message) {

            setMessage(message);


            // var formattedTime = moment(message.createdAt).format('h:mm a')

            // // console.log('New message', message);
            // // var li = jQuery('<li></li>');
            // // li.text(`${message.from} ${formattedTime}: ${message.text}`);

            // // jQuery('#messages').append(li);
            // var template = jQuery('#message-template').html();
            // var html = Mustache.render(template, {
            //     text: message.text,
            //     from: message.from,
            //     createdAt: formattedTime
            // });

            // jQuery('#messages').append(html);
            // scrollToBottom();
        });

        jQuery(`#message-form`).on('submit', function (e) {
            e.preventDefault();

            var messageTextbox = jQuery('[name=message]');

            socket.emit('createMessage', {
                text: messageTextbox.val()
            }, function () {
                messageTextbox.val('');
            });
        });
    });


    // socket.on('setNewRoom', (room)=>{})
}
