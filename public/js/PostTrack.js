$(document).on('pagebeforeshow', '#posttrack', function(){  
        $(document).on('click', '#submit', function() { // catch the form's submit event
        if($('#content').val().length > 0){            
            var userName = 'Tester';
            var userId = '529cc18bea75cee226f7af85';

            var track = {};
            track.content = $('#content').val();
            track.user = {};
            track.user._id = userId;
            track.user.name = userName;
            track.content = $('#content').val();

            tripbookController.postTrack(track);              

        } else {
            alert('Please fill content');
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
