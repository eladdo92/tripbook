$(document).ready(function(){
    $('#login').submit(function(event){
        var email = $(this).find('#email').val();
        var password = $(this).find('#password').val();

        tripbookController.authenticate(email, password);
        event.preventDefault();
        return false;
    });
});