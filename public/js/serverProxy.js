'use strict';

var serverProxy = (function($) {
    var baseUrl = '/';

    function getFeed(userId) {
        var url = baseUrl + 'feed/' + userId;
        return $.getJSON(url);
    }

    function getProfile(userId) {
        var url = baseUrl + 'tracks/user/' + userId;
        return $.getJSON(url);
    }

    function getPlacePage(placeId) {
        var url = baseUrl + 'tracks/place/' + placeId;
        return $.getJSON(url);
    }

    function like(tripId, userId) {
        var url = baseUrl + 'tracks/like/' + tripId;
        return $.ajax({
            type: 'put',
            url: url,
            data: { user_id: userId }
        });
    }

    function dislike(tripId, userId) {
        var url = baseUrl + 'tracks/like/' + tripId;
        return $.ajax({
            type: 'delete',
            url: url,
            data: { user_id: userId }
        });
    }

    function comment(tripId, userId, userName, comment) {
        var url = baseUrl + 'tracks/comment/' + tripId;

        var comment = {
            content: comment,
            user: {
                _id: userId,
                name: userName
            }
        };

        return $.ajax({
            type: 'PUT',
            url: url,
            data: comment
        });
    }

    function login(email, password) {
        var url = baseUrl + 'login';
        return $.post(url, { email: email, password: password });
    }
    
    function Register(user) {
        var url = baseUrl + 'users/new/';
        return $.ajax({ type: 'POST', url: url, data: user });    
    }    

    function PostTrack(track) {
        var url = baseUrl + 'tracks/new';
        return $.ajax({ type: 'POST', url: url, data: track });  
    }
    
    function addPlace(placeName) {
        var place = {};
        place.name = placeName;
        var url = baseUrl + 'places/new';
        return $.ajax({ type: 'POST', url: url, data: place, async:false });  
    }

    function getPlace(placeName) {
        var url = baseUrl + 'place?placeName=' + placeName;
        return $.ajax({ type: 'GET', dataType: "json", url: url, async:false });  
    }

    function addFriend(userId, friendId) {
        var data = {
            user: {
                _id: userId,
                name: ''
            },
            friend: {
                _id: friendId,
                name: ''
            }
        };
        return $.ajax({
            type: 'PUT',
            url: baseUrl + 'user/friend/new',
            data: data
        });
    }

    function getUsers(){
        var url = baseUrl + 'users/all';
        return $.get(url);
    }


    function getPlaces(){
        var url = baseUrl + 'places/all';
        return $.get(url);
    }

    return {
        getFeed: getFeed,
        getProfile: getProfile,
        getPlacePage: getPlacePage,
        like: like,
        login: login,
        Register : Register,
        PostTrack : PostTrack,
        dislike: dislike,
        comment: comment,
        addFriend: addFriend,
        getUsers: getUsers,
        getPlaces: getPlaces,
        getPlace: getPlace,
        addPlace: addPlace
    };

})(jQuery);
