var user1 = {
    name:"Ben Hodeda",
    email:"benhodeda@gmail.com",
    password:"123456789"
};

var user2 = {
    name:"Elad Douenias",
    email:"eladdo92@gmail.com",
    password:"123456789"
};

var user3 = {
    name:"Oded Cagan",
    email:"odedcagan@gmail.com",
    password:"123456789"
};

var test_data = [user1, user2, user3];

var db = require('common').connect('tripbook', 'users', test_data);

exports.forExample = function() {
    console.log('from DAL/users');
};

exports.getUserPlaces = function(id) {
    //TODO: implement
    return ['id1', 'id2'];
};

exports.getUserFriends = function(id) {
    //TODO: implement
    return ['id1', 'id2'];
};