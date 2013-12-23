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
        htmlGenerator.dislikeTrip(tripId);
    }

    function addComment(tripId, commentSelector) {
        var comment = $(commentSelector).val();
        if(!comment) return;
        htmlGenerator.addComment(tripId, comment, userManager.getCurrentUser());
    }

    function register(user) {
        console.log('Controller: Registering new user');
        var registerPromise = serverProxy.Register(user);
        console.log(registerPromise);
        var html = registerPromise;
        //TODO
        //html = 'success' or failure
        //var html = htmlGenerator.generateTrips(placePagePromise);

        return html;
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
        userManager.login(); //just for now...
        var userId = userManager.getCurrentUser()._id;

        if(userId) {
            getFeed(userId).then(function(feed) {
                $('#feedContent').html(feed);
            });
        }
        else {
            $('#feedContent').html(htmlGenerator.loginLink());
        }

    }

    return {
        init: init,
        likeTrip: likeTrip,
        dislikeTrip: dislikeTrip,
        addComment: addComment,
        register: register,
        postTrack: postTrack
    };

})(jQuery, serverProxy, htmlGenerator, userManager);

tripbookController.init();
