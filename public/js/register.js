$(document).ready(function(){
    $('#register').submit(function(event){
        var user = {};
        user.name = $('#username').val();
        user.email = $(this).find('#email').val();
        user.password = $(this).find('#password').val();

        tripbookController.register(user);        

        event.preventDefault();
        return false;
    });
});
