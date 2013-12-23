'use strict';

var serverProxy = (function($) {
    var baseUrl = 'http://localhost:801/';

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

    function login(email, password) {
        var url = baseUrl + 'login' + tripId;
        return $.post(url, { email: email, password: password });
    }
    
        function Register(user) {
        var url = baseUrl + 'users/new/';
        $.post(url, user, function (data) {
            console.log('register finished, result:' + data);
        })
    }

    function PostTrack(track) {
        var url = baseUrl + 'tracks/new';
        $.post(url, track, function (data) {
            console.log('posttrack finished, result:' + data);
        })
    }

    return {
        getFeed: getFeed,
        getProfile: getProfile,
        getPlacePage: getPlacePage,
        like: like,
        login: login,
        Register : Register,
        PostTrack : PostTrack
    };

})(jQuery);
