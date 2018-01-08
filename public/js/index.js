var socket = io();

socket.on('displayRooms', function (rooms) {
    
        var template = jQuery('#active-room').html();
        console.log(rooms);
        // var options = [];
        // for(var i=0; i<rooms.length;i++)
        // options[i] = jQuery('<option></option>').text(rooms[i]);
        rooms.forEach(function (room) {
            jQuery('#select').append(jQuery('<option></option>').text(room)); 
    });
    
    
});

window.onload = function(){
    var div = jQuery('#greet-user');
    var uname = jQuery.deparam(window.location.search);
    div.append(jQuery('<h3></h3>').text('Welcome ' + uname.name + ' !'));
    return;
}
