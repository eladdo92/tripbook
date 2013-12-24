'use strict';

var userManager = (function(serverProxy) {
    var currentUserId = '';
    var currentUserName = '';
    var isLoggedIn = false;

    function login(email, password) {
        serverProxy.login(email, password).done(function(user){
            if(user.error){
                alert("Unauthorized");
            }
            else {
                isLoggedIn = true;
                currentUserId = user._id;
                currentUserName = user.name;
            }
        });
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