$(document).ready(function(){
    $('#posttrack').submit(function(event){

        var user = userManager.getCurrentUser();
        var userName = user.name;
        var userId = user._id;

        var track = {};
        track.content = $('#content').val();
        track.user = {};
        track.user._id = userId;
        track.user.name = userName;
        track.content = $('#content').val();

        tripbookController.postTrack(track);   

        event.preventDefault();
        return false;
    });
});
