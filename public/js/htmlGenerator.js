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
        var $commentsContainer = $('<div>').append('<h4>comments:</h4>');
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
        var $input = $('<input type="text" placeholder="enter comment...">');
        var selector = getCommentTxtSelector(tripId);
        var $btn = $('<input type="button" value="send" onclick="tripbookController.addComment(\''+tripId+'\', \''+selector+'\')">');
        return $('<div class="commentsForm">').append($input, $btn);
    }

    function addComment(tripId, comment, user) {
        var $comments = $('#trip' + tripId +' .comments');
        var $comment = generateComment({user: user, content: comment});
        $(getCommentTxtSelector(tripId)).val(null);
        $comments.append($comment);
        render();
    }

    function generatePlaceLink(placeObj) {
        var placeName = placeObj.name;
        var placeLink = '../?id=' + placeObj._id +'&name='+ placeName+'#place';
        return $('<a href="'+placeLink+'">'+placeName+'#</a>');
    }

    function generateUserLink(userObj) {
        var useName = userObj.name;
        var userLink = '../?id=' + userObj._id + '&name='+ useName+'#userProfile';
        return $('<a href="'+userLink+'">'+useName+'</a>');
    }

    function generateLikes(likesArray, tripId) {
        var likeCounter = likesArray ? likesArray.length || 0 : 0;
        var $likeCounter = $('<span class="likeCounter">').text(likeCounter);
        var text = ' people liked it ';
        return $('<span class="likes">').append($likeCounter).append(text).append(generateLikeFrom(tripId, likesArray));
    }

    function generateLikeFrom(tripId, likesArray) {
        var $btn = $('<input type="button" value="like" onclick="tripbookController.likeTrip(\''+tripId+'\')">');
        if(userManager.doesUserLikeTrack(likesArray)) {
            $btn = changeToDislikeFrom($btn, tripId);
        }
        return $btn;
    }

    function updateLikeFrom(tripId) {
        $('#trip'+tripId+' .likes input')
            .attr('value', 'like')
            .attr('onclick', 'tripbookController.likeTrip(\''+tripId+'\')')
            .button('refresh');
        render();
    }

    function updateDislikeFrom(tripId) {
        $('#trip'+tripId+' .likes input')
            .attr('value', 'dislike')
            .attr('onclick', 'tripbookController.dislikeTrip(\''+tripId+'\')')
            .button('refresh');
        render();
    }

    function changeToDislikeFrom($button, tripId) {
        return $button
            .attr('value', 'dislike')
            .attr('onclick', 'tripbookController.dislikeTrip(\''+tripId+'\')');
    }

    function updateLikesCounter(tripId, decrease) {
        var $likesCounter = $('#trip'+tripId+' .likeCounter');
        var counter = +$likesCounter[0].innerText;
        decrease ? counter-- : counter ++;
        $likesCounter.text(counter);
    }

    function generateTrip(tripObj) {
        var $userLink = generateUserLink(tripObj.user);

        var tripContent = tripObj.content;
        var $tripContent = $('<h3>').text(tripContent);

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
            $trips.append('<hr />');
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
        return $('<a href="#login">login</a>');
    }

    function likeTrip(tripId) {
        updateLikesCounter(tripId);
        updateDislikeFrom(tripId);
    }

    function dislikeTrip(tripId) {
        updateLikesCounter(tripId, true);
        updateLikeFrom(tripId);
    }

    function getTitle(title) {
        title = title || 'Feed';
        return $('<h1></h1>').text(title);
    }

    function render(){
        $('#feed').trigger('pagecreate');
    }

    function generateAddFriendBtn(areFriends, friendId) {
        if(areFriends) return $('');
        return $('<input type="button" id="addFriend">')
            .attr('value', 'Add friend')
            .attr('onclick', 'tripbookController.addFriend(\''+friendId+'\')');
    }

    function updateAddFriendBtn() {
        $('#addFriend').remove();
        $('#profile').trigger('pagecreate');
    }

    function generateUsersList(users_list, container){
        $(users_list).each(function(i, user){
            if (!user.error && user.name && user.email){
                var a = generateUserLink(user).text("");
                var name = $('<h1/>').text(user.name).addClass('entity');
                a.append(name);
                if(user.photo){
                    var photo = $('<p/>').text(user.photo).addClass('entity');
                    a.append(photo);
                }
                var email = $('<p/>').text(user.email).addClass('entity');
                a.append(email);
                var li = $('<li/>').addClass('users-list').append(a);
                container.append(li).listview('refresh');
            }
        });
    }

    function generatePlacesList(places_list, container){
        $(places_list).each(function(i, place){
            if (!place.error && place.name){
                var a = generatePlaceLink(place).text('');
                var name = $('<h1/>').text(place.name).addClass('entity');
                a.append(name);
                var li = $('<li/>').append(a);
                container.append(li).listview('refresh');
            }
        });
    }

    return {
        generateTrips: generateTripsPromise,
        loginLink: loginLink,
        likeTrip: likeTrip,
        dislikeTrip: dislikeTrip,
        addComment: addComment,
        render: render,
        getTitle: getTitle,
        generateAddFriendBtn: generateAddFriendBtn,
        addFriend: updateAddFriendBtn,
        generateUsersList: generateUsersList,
        generatePlacesList: generatePlacesList
    };

})(jQuery);