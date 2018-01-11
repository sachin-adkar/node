// jQuery('#join-form').on('submit', function (e) {
//     e.preventDefault();
//     var room = jQuery('#room').val();
//     // var activeRoom = jQuery('#select').val();
//     if (!room) {
//         if (!activeRoom) {
//             alert('Please create or join a room');
//             return;
//         }
//         room = activeRoom;
//     }
//     setRoom(room, true);
// });

// var removeRoomForm = function(){
//     $('#centered-form__form').hide();
// }





















// jQuery(`#join-form`).on('submit', function (e) {
//     var params = jQuery.deparam(window.location.searh);

//    console.log('getting value', localStorage.getItem("userName"));


//     // params.name = localStorage.getItem('userName');
//     // console.log(params.name);

//     // localStorage.removeItem('userName');
//     if (!params.room) {
//         params.room = params.activeRoom;
//     }
//     socket.emit('join', params, function (err) {
//         if (err) {
//             alert(err);
//             window.location.href = `/next.html?name=${params.name}`;
//         } else {
//             console.log('No error');
//         }
//     })
//     });


//  socket.on('displayRooms', function (rooms) {

//      var template = jQuery('#active-room').html();
//      console.log(rooms);
//     rooms.forEach(function (room) {
//          jQuery('#select').append(jQuery('<option></option>').text(room));
//      });
//  });

// socket.on('displayUsers', function (users) {
//     var ul = jQuery('<ul></ul>');

//     users.forEach(function (user) {
//         console.log(user);

//         ul.append(jQuery('<li></li>').text(user));
//     });
//     jQuery('#displayUsers').html(ul);
//     });









