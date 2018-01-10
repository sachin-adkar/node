var params = jQuery.deparam(window.location.searh);

if (!params.room) {
 params.room = params.activeRoom;
}
socket.emit('join', params, function (err) {
 if (err) {
     alert(err);
     window.location.href = '/';
 } else {
     console.log('No error');
 }
})