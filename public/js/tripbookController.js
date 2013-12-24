'use strict';

var tripbookController = (function($, serverProxy, htmlGenerator, userManager) {

    function getFeed(userId) {
        var feedPromise = serverProxy.getFeed(userId);
        return htmlGenerator.generateTrips(feedPromise);
    }

    function getProfile(userId) {
        var profilePromise = serverProxy.getProfile(userId);
        return htmlGenerator.generateTrips(profilePromise);
    }

    function getPlacePage(placeId) {
        var placePagePromise = serverProxy.getPlacePage(placeId);
        return htmlGenerator.generateTrips(placePagePromise);
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

    function authenticate(email, password){
        userManager.login(email, password);
        init();
    }

    function init() {
        if (!userManager.isLoggedIn()) {
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

    }

    return {
        init: init,
        authenticate: authenticate,
        likeTrip: likeTrip,
        dislikeTrip: dislikeTrip,
        addComment: addComment
    };

})(jQuery, serverProxy, htmlGenerator, userManager);

tripbookController.init();