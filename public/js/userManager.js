'use strict';

var userManager = (function(serverProxy) {
//    var currentUserId = '';
//    var currentUserName = '';
    var currentUser = {};
    var isLoggedIn = false;

    function login(email, password) {
        return serverProxy.login(email, password).done(function(user){
            if(user.error){
                alert("Unautoraized");
            }
            else {
                isLoggedIn = true;
                currentUser = user;
//                currentUserId = user._id;
//                currentUserName = user.name;

                location.replace(CONFIG.feed_location);
            }
        });
//        currentUserId = '52a08b7994a39b0740000004';
//        currentUserName = 'Oded Cagan';
//        isLoggedIn = false;
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