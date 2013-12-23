$(document).on('pagebeforeshow', '#register', function(){  
        $(document).on('click', '#submit', function() { // catch the form's submit event
        if($('#username').val().length > 0 && $('#email').val().length > 0 && $('#password').val().length > 0){            
            var user = {};
            user.name = $('#username').val();
            user.email = $('#email').val();
            user.password = $('#password').val();    

            tripbookController.register(user);              

        } else {
            alert('Please fill all nececery fields');
        }           
            return false; //cancel original event to prevent form submitting
        });    
});

$(document).on('pagebeforeshow', '#second', function(){     
    $('#second [data-role="content"]').append('This is a result of form submition: ' + resultObject.formSubmitionResult);  
});

var resultObject = {
    formSubmitionResult : null  
}
