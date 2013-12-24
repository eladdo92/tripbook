'use strict';

var tripbookController = (function($, serverProxy, htmlGenerator, userManager) {

    function getFeed(userId) {
        var feedPromise = serverProxy.getFeed(userId);
        var html = htmlGenerator.generateTrips(feedPromise);
        return html;
    }

    function getProfile(userId) {
        var profilePromise = serverProxy.getProfile(userId);
        var html = htmlGenerator.generateTrips(profilePromise);
        return html;
    }

    function getPlacePage(placeId) {
        var placePagePromise = serverProxy.getPlacePage(placeId);
        var html = htmlGenerator.generateTrips(placePagePromise);
        return html;
    }

    function getURLParameter(name, url) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url || location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    function likeTrip(tripId) {
        serverProxy.like(tripId, userManager.getCurrentUser()._id)
            .success(function(){
                htmlGenerator.likeTrip(tripId);
            })
            .fail(function(error) {
                htmlGenerator.likeTrip(tripId);
                console.log(error);
            });

    }

    function dislikeTrip(tripId) {
        serverProxy.dislike(tripId, userManager.getCurrentUser()._id)
            .success(function(){
                htmlGenerator.dislikeTrip(tripId);
            })
            .fail(function(error) {
                htmlGenerator.dislikeTrip(tripId);
                console.log(error);
            });
    }

    function addComment(tripId, commentSelector) {
        var comment = $(commentSelector).val();
        if(!comment) return;

        var user = userManager.getCurrentUser();
        serverProxy.comment(tripId, user._id, user.name, comment)
            .success(function() {
                htmlGenerator.addComment(tripId, comment, userManager.getCurrentUser());
            })
            .fail(function(error) {
                htmlGenerator.addComment(tripId, comment, userManager.getCurrentUser());
                console.log(error);
            });
    }
    var urlParams = {};

    function authenticate(email, password){
        userManager.login(email, password);
        if(userManager.getCurrentUser()._id) {
            location.replace(CONFIG.feed_location);
            init();
        }
        else {
            alert("Unauthorized");
        }
    }

    function register(user) {
        console.log('Controller: Registering new user');
        serverProxy.Register(user)
        .success(function() {
            
                userManager.login(user.email, user.password).done(function() {
                tripbookController.init();
                });

                init();
            })
            .fail(function(error) {
                //htmlGenerator.generateError();
                alert("Error can't register user, error:" + error);
                console.log(error);
            });
    }

    function postTrack(track) {
        console.log('Controller: Posting a track');
        var postTrackPromise = serverProxy.PostTrack(track);
        var html = postTrackPromise;
        //TODO
        //var html = htmlGenerator.generateTrips(placePagePromise);
        return html;
    }

    function init() {
        var userId = userManager.getCurrentUser()._id;
        if(!userId) return;

        function initHelper() {
            clear();
            if(userId) {
                getFeed(userId).then(function(feed) {
                    $('#feedContent').append(htmlGenerator.getTitle());
                    if(feed[0].childNodes.length === 0) {
                        $('#feedContent').append($('<div></div>').text('no tracks to show'));
                    }
                    else {
                        $('#feedContent').append(feed);
                    }
                    $('#feed').trigger('pagecreate');
                });
            }
            else {
                $('#feedContent').html(htmlGenerator.loginLink());
            }
            var id;
            if(id = urlParams.id) {
                getProfile(id).then(function(profile) {
                    $('#profileContent').append(htmlGenerator.getTitle(urlParams.name));
                    var addFriendBtn = htmlGenerator.generateAddFriendBtn(userManager.isUserFriendsWith(id), id);
                    $('#profileContent').append(addFriendBtn);
                    if(profile[0].childNodes.length === 0) {
                        $('#profileContent').append($('<div></div>').text('no tracks to show'));
                    }
                    else {
                        $('#profileContent').append(profile);
                    }
                    $('#userProfile').trigger('pagecreate');
                });
                getPlacePage(id).then(function(placePage) {
                    $('#placeContent').append(htmlGenerator.getTitle(urlParams.name));
                    if(placePage[0].childNodes.length === 0) {
                        $('#placeContent').append($('<div></div>').text('no tracks to show'));
                    }
                    else {
                        $('#placeContent').append(placePage);
                    }
                    $('#place').trigger('pagecreate');
                });
            }

            function clear() {
                $('#feedContent').empty();
                $('#profileContent').empty();
                $('#placeContent').empty();
            }
        }

        initHelper();
        $('a').live('click', function() {
            var url = $(this).attr('href');
            urlParams.id = getURLParameter('id', url);
            urlParams.name = getURLParameter('name', url);
        });
        $('a').live('click', initHelper);
    }

    function addFriend(friendId) {
        serverProxy.addFriend(userManager.getCurrentUser()._id, friendId)
            .success(function() {
                htmlGenerator.addFriend();
            }).fail(function(error) {
                htmlGenerator.addFriend();
                console.log(error);
            });
        console.log(friendId);
    }

    return {
        init: init,
        authenticate: authenticate,
        likeTrip: likeTrip,
        dislikeTrip: dislikeTrip,
        addComment: addComment,
        register: register,
        postTrack: postTrack,
        addFriend: addFriend
    };

})(jQuery, serverProxy, htmlGenerator, userManager);

tripbookController.init();
