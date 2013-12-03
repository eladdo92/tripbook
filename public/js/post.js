$(document).ready(function(){
    $('#post').on('click', function(){
        var track = {};
        var user = $('#users').find(':selected');
        track.user = {};
        track.user._id = user.val();
        track.user.name = user.text();
        track.content = $('#content').val();
        $.post('tracks/new', track, function(data){
            console.log(data);
        })
    });
});