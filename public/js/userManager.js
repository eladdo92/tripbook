'use strict';

var userManager = (function(serverProxy) {
    var currentUser = {};
    var isLoggedIn = false;

    function login(email, password, callback) {
        return serverProxy.login(email, password).done(function(user){
            if(!user.error){
                isLoggedIn = true;
                currentUser = user;
            }
            callback();
        });
    }

    function doesUserLikeTrack(trackLikes) {
        if(!trackLikes) return false;
        try {
            return trackLikes.indexOf(currentUser._id) !== -1;
        }
        catch (ex) {
            return false;
        }
    }

    function isUserFriendsWith(friendId) {
        var friends = currentUser.friends;
        if(!friends) return false;
        for(var i = 0; i< friends.length; i++) {
            if(friends[i]._id == friendId) {
                return true;
            }
        }
        return false;
    }

    return {
        getCurrentUser: function() {
            return currentUser;
        },
        isLoggedIn: function() {
            return isLoggedIn;
        },
        login: login,
        doesUserLikeTrack: doesUserLikeTrack,
        isUserFriendsWith: isUserFriendsWith
    };
})(serverProxy);