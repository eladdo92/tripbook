$(document).ready(function(){
    $('#login').submit(function(event){
        var email = $(this).find('#email').val();
        var password = $(this).find('#password').val();

        userManager.login(email, password);


        //var details = {
        //    email : email,
        //    password : password
        //};

        //$.post("/login", details, function(data){
        //    console.log(data);
        //    if(data.error){
        //        alert("Unautoraized");
        //    }
        //    else {
        //        location.replace(CONFIG.feed_location)
        //    }
        //});
        event.preventDefault();
        return false;
    });
});