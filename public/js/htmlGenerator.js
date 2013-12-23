'use strict';

var htmlGenerator = (function($) {

    function generatePlacesTags(places) {
        if(!places || !places.length) {
            return $('');
        }

        var $tags = $('<div>');
        for(var i = 0; i< places.length; i++) {
            var $link = generatePlaceLink(places[i]);
            $tags.append($link);
            if(i != places.length - 1) {
                $tags.append(' , ');
            }
        }

        return $tags;
    }

    function generateComment(comment) {
        var $comment = $('<div>');
        var $userLink = generateUserLink(comment.user);
        var $content = $('<div>').text(comment.content);
        return $comment.append($userLink).append($content);
    }

    function generateComments(comments, tripId) {
        var $commentsContainer = $('<div>').append('<h4>תגובות:</h4>');
        var $comments = $('<div class="comments">');

        if(comments && comments.length !== 0) {
            for(var i = 0; i < comments.length; i++) {
                var $comment = generateComment(comments[i]);
                $comments.append($comment);
            }
        }

        var $commentForm = generateCommentForm(tripId);
        $commentsContainer.append($comments).append($commentForm);
        return $commentsContainer;
    }

    function getCommentTxtSelector(tripId) {
        return '#trip' + tripId + ' .commentsForm input[type=text]';
    }

    function generateCommentForm(tripId) {
        var $input = $('<input type="text" placeholder="הכנס תגובה...">');
        var selector = getCommentTxtSelector(tripId);
        var $btn = $('<input type="button" value="שלח" onclick="tripbookController.addComment(\''+tripId+'\', \''+selector+'\')">');
        return $('<div class="commentsForm">').append($input, $btn);
    }

    function addComment(tripId, comment, user) {
        var $comments = $('#trip' + tripId +' .comments');
        var $comment = generateComment({user: user, content: comment});
        $(getCommentTxtSelector(tripId)).val(null);
        $comments.append($comment);
    }

    function generatePlaceLink(placeObj) {
        var placeLink = 'place/' + placeObj._id;
        var placeName = placeObj.name;
        return $('<a href="'+placeLink+'">'+placeName+'#</a>');
    }

    function generateUserLink(userObj) {
        var userLink = 'profile/' + userObj._id;
        var useName = userObj.name;
        return $('<a href="'+userLink+'">'+useName+'</a>');
    }

    function generateLikes(likesArray, tripId) {
        var likeCounter = likesArray ? likesArray.length || 0 : 0;
        var $likeCounter = $('<span class="likeCounter">').text(likeCounter);
        var text = 'אנשים אהבו זאת';
        return $('<span class="likes">').append(text).append($likeCounter).append(generateLikeFrom(tripId));
    }

    function generateLikeFrom(tripId) {
        return $('<input type="button" value="אהבתי" onclick="tripbookController.likeTrip(\''+tripId+'\')">');
    }

    function generateDislikeFrom(tripId) {
        return $('<input type="button" value="לא אהבתי" onclick="tripbookController.dislikeTrip(\''+tripId+'\')">');
    }

    function removeLikeBtn(tripId) {
        $('#trip'+tripId+' .likes input').remove();
    }

    function updateLikesCounter(tripId, decrease) {
        var $likesCounter = $('#trip'+tripId+' .likeCounter');
        var counter = +$likesCounter.text();
        decrease ? counter-- : counter ++;
        $likesCounter.text(counter);
    }

    function generateTrip(tripObj) {
        var $userLink = generateUserLink(tripObj.user);

        var tripContent = tripObj.content;
        var $tripContent = $('<div>').text(tripContent);

        var $tags = generatePlacesTags(tripObj.places);
        var $likes = generateLikes(tripObj.likes, tripObj._id);
        var $comments = generateComments(tripObj.comments, tripObj._id);

        return $('<div id="trip'+tripObj._id+'"></div>')
            .append($userLink)
            .append($tripContent)
            .append($tags)
            .append($likes)
            .append($comments);
    }

    function generateTripArray(trips) {
        var $trips = $('<div>');

        for(var i = 0; i < trips.length; i++) {
            var $currentTrip = generateTrip(trips[i]);
            $trips.append($currentTrip);
        }

        return $trips;
    }

    function generateTripsPromise(promise) {
        var dfd = $.Deferred();

        promise
            .success(function(trips) {
                dfd.resolve(generateTripArray(trips));
            })
            .fail(function() {
                dfd.reject(generateError());
            });

        return dfd.promise();
    }

    function generateError() {
        return $('<div>').text('error!');
    }

    function loginLink() {
        return $('<a href="#login">התחבר</a>');
    }

    function likeTrip(tripId) {
        updateLikesCounter(tripId);
        removeLikeBtn(tripId);
        $('#trip'+tripId+' .likes').append(generateDislikeFrom(tripId));
    }

    function dislikeTrip(tripId) {
        updateLikesCounter(tripId, true);
        removeLikeBtn(tripId);
        $('#trip'+tripId+' .likes').append(generateLikeFrom(tripId));
    }

    return {
        generateTrips: generateTripsPromise,
        loginLink: loginLink,
        likeTrip: likeTrip,
        dislikeTrip: dislikeTrip,
        addComment: addComment
    };

})(jQuery);