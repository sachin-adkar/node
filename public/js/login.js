socket = io();

jQuery(`#login-form`).on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'GET',
        url: '/login',
        data: {
            name: jQuery('#name').val(),
            password: jQuery('#password').val()
        },
        success: function (message) {
            alert(message);
            var name = jQuery('#name').val();
            localStorage.setItem('userName', name);
            console.log('value set');
            window.location.href = `/next.html?name=${name}`;
            // socket('connect', function(){
                
        
            //     socket.emit('showOnline', name, function(err){
            //         if(err){
            //             console.log(err);                     
            //         }
            //         else{
            //             console.log('There is no error');
                        
            //         }
            //     } )
            // });
           

        },
        error: function (xhr, status, error) {
            if(status)
            alert('User name and password do not match !');
        }
    });
});


