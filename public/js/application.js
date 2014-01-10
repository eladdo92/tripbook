$('#loginPage').live('pageinit', function() {
    $('#login').submit(function(event){
        var email = $(this).find('#email').val();
        var password = $(this).find('#password').val();
        tripbookController.authenticate(email, password);
        event.preventDefault();
        return false;
    });
});

$('#friends').live('pageinit', function() {
    tripbookController.usersList();
});

$('#registerpage').live('pageinit',function(){
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

$('#posttrackpage').live('pageinit',function(){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var latlon = position.coords.latitude + "," + position.coords.longitude;

            var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
                + latlon + "&zoom=14&size=400x300&sensor=false";
            document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
        });
    }

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

$('#places').live('pageinit', function(){
    tripbookController.placesList();
});

$('#feed').live('pageinit', function(){
    $('#searchFriends').click(function(){
        $( "#friends" ).panel( "open");
    });
    $('h1').live('swiperight', function(){
        $('#searchFriends').trigger('click');
    });
});