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
        addComment: addComment
    };

})(jQuery, serverProxy, htmlGenerator, userManager);

tripbookController.init();