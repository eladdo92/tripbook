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

    function init() {
        userManager.login(); //just for now...
        var userId = userManager.getCurrentUser()._id;

        function initHelper() {
            clear();
            if(userId) {
                getFeed(userId).then(function(feed) {
                    $('#feedContent').append(htmlGenerator.getTitle()).append(feed);
                    $('#feed').trigger('pagecreate');
                });
            }
            else {
                $('#feedContent').html(htmlGenerator.loginLink());
            }
            var id;
            if(id = urlParams.id) {
                getProfile(id).then(function(profile) {
                    $('#profileContent').append(htmlGenerator.getTitle(urlParams.name)).append(profile);
                    $('#userProfile').trigger('pagecreate');
                });
                getPlacePage(id).then(function(placePage) {
                    $('#placeContent').append(htmlGenerator.getTitle(urlParams.name)).append(placePage);
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
            urlParams.id=getURLParameter('id', url);
            urlParams.name = getURLParameter('name', url);
        });
        $('a').live('click', initHelper);
    }

    return {
        init: init,
        likeTrip: likeTrip,
        dislikeTrip: dislikeTrip,
        addComment: addComment,
    };

})(jQuery, serverProxy, htmlGenerator, userManager);

tripbookController.init();