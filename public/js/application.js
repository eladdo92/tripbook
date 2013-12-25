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
    $.get("/places/all", function(data){
        $(data).each(function(i, item){
            if (!item.error && item.name){
                var a = $('<a/>').attr('href', '/');
                var li = $('<li/>').append(a);
                var name = $('<h1/>').text(item.name).addClass('entity');
                li.append(name);
                $('#places_list').append(li).listview('refresh');
            }
        });
    });
});

$('#feed').live('pageinit', function(){
    $('#searchFriends').click(function(){
        $( "#friends" ).panel( "open");
    });
    $('h1').live('swiperight', function(){
        $('#searchFriends').trigger('click');
    });
});