'use strict';

var userManager = (function(serverProxy) {
    var currentUserId = '';
    var currentUserName = '';
    var isLoggedIn = false;

    function login(email, password) {
//        serverProxy.login(email, password).done(function(user){
//            if(user.error){
//                alert("Unautoraized");
//            }
//            else {
//                isLoggedIn = true;
//                currentUserId = user._id;
//                currentUserName = user.name;
//
//                location.replace(CONFIG.feed_location)
//            }
//        });
        currentUserId = '52a2099a1a1051660c7d8c77';
        currentUserName = 'Oded Cagan';
        isLoggedIn = false;
    }

    return {
        getCurrentUser: function() {
            return {
                _id: currentUserId,
                name: currentUserName
            };
        },
        isLoggedIn: function() {
            return isLoggedIn;
        },
        login: login
    };
})(serverProxy);