var socket = io();

socket.on('displayRooms', function (rooms) {
    
        var template = jQuery('#active-room').html();
        console.log(rooms);
        // var options = [];
        // for(var i=0; i<rooms.length;i++)
        // options[i] = jQuery('<option></option>').text(rooms[i]);
        rooms.forEach(function (room) {
            console.log('Active rooms', room);
            jQuery('#select').append(jQuery('<option></option>').text(room)); 
    });
    
    
});
