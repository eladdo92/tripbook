$(document).ready(function(){

    $.get('users/all', function(data){
        data.forEach(function(item){
            $('#users').append($('<option></option>').val(item._id).text(item.name));
        });
    });

    $.get('places/all', function(data){
        data.forEach(function(item){
            $('#places').append($('<option></option>').val(item._id).text(item.name));
        });
    });

    $('#create').on('click', function(){
        var user = $('#users').find(':selected');
        var place = $('#places').find(':selected');
        var data = {
            user : {
                _id : user.val(),
                name : user.text()
            },
            place : {
                _id : place.val(),
                name : place.text()
            }
        };
        $.ajax({
            type: 'PUT',
            url: 'user/place/follow',
            data: data
        }).always(function(res) {console.log(res);});
    });
});