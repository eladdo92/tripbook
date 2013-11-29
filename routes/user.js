

if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
     mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
     mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"usersdb"
    }
}

var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');

    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
};

var mongourl = generate_mongo_url(mongo);

var db = null;

require('mongodb').connect(mongourl, function(err, conn){

    db = conn;
    if(!err) {
        console.log("Connected to 'usersdb' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

var populateDB = function() {

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

    db.collection('users', function(err, collection) {
        collection.insert(user1, {safe:true}, function(err, result) {
            console.log("user1 result = " + result);
            console.log("err = " + err);
        });
        collection.insert(user2, {safe:true}, function(err, result) {
            console.log("user2 result = " + result);
            console.log("err = " + err);
        });
        collection.insert(user3, {safe:true}, function(err, result) {
            console.log("user3 result = " + result);
            console.log("err = " + err);
        });

    });

};

function isFriendExist(user_id, friend_id){
    var user = db.users.findOne({"_id" : user_id, "friends" : { $elemMatch : {"_id" : friend_id}}});
    return user? user : false;
}

function isPlaceExist(user_id, place_id){
    var user = db.users.findOne({"_id" : user_id, "places" : { $elemMatch : {"_id" : place_id}}});
    return user? user : false;
}

function appendFriend(collection, user_id, friend_id, friend_name, callback){
    var user = isFriendExist(user_id, friend_id);
    if (!user){
        collection.update({ '_id' : user_id },
            { $push : { 'friends' : { '_id' : friend_id, 'name' : friend_name } } },
            { safe : true },
            function(err, result) {
                if (err) {
                    console.log('Error updating users : ' + err);
                    callback.failed(err);
                }
                callback.success(result);
            });
    }
    callback(user);
}

function removeFriend(collection, user_id, friend_id){
    if (isFriendExist(user_id, friend_id)){
        collection.update({"_id" : user_id}, { $pull : { "friends" : {"_id" : friend_id } } },
            function(err, result){
                if (err){
                    console.log('Error rolling back friendship: ' + err);
                    return false;
                }
                return true;
            });
    }
    return true;
}

function removeFriendship(collection, user_id1, user_id2){
    while (!removeFriend(collection, user_id1, user_id2)){}
    while (!removeFriend(collection, user_id2, user_id1)){}
}

function rollbackFriendship(id1, id2, err, response){
    console.log('crating friendship failed: ' + err);
    removeFriendship(id1, id2);
    response.send({'error':'An error has occurred'});
}

function appendPlace(collection, user_id, place_id, place_name, callback){
    var user = isPlaceExist(user_id, place_id);
    if (!user){
        collection.update({ '_id' : user_id },
            { $push : { 'places' : { '_id' : place_id, 'name' : place_name } } },
            { safe : true },
            function(err, result) {
                if (err) {
                    console.log('Error updating users : ' + err);
                    callback.failed(err);
                }
                callback.success(result);
            });
    }
    callback(user);
}

exports.addFriend = function(req, res){
    var user1 = req.body.user1;
    var user2 = req.body.user2;
    console.log('stating creating friendship between user1 = ' + user1 + ' and user2 = ' + user2);
    if (!(isFriendExist(user1._id, user2._id) && isFriendExist(user2._id, user1._id))){
        db.collection('users', function(err, collection){
                if (err){
                    console.log('Error updating users collection: ' + err);
                    res.send({'error':'An error has occurred'});
                }
                else {
                    appendFriend(collection, user1._id, user2._id, user2.name, {
                        success : function(user) {
                            appendFriend(collection, user2._id, user1._id, user1.name, {
                                success : function(friend) {
                                    console.log('finish creating friendship');
                                    res.send({ 'user' : user, 'friend' : friend });
                                },
                                failed : function(err) { rollbackFriendship(user1._id, user2._id, err, res);}
                            });
                        },
                        failed : function(err) { rollbackFriendship(user1._id, user2._id, err, res); }
                    });
                }
            }
        );
    }
    res.send({ 'user' : user1, 'friend' : user2 });
};

exports.followPlace = function(req, res){
    var user = req.body.user;
    var place = req.body.place;
    console.log('stating creating user = ' + user + ' follow ' + place);

    db.collection('users', function(err, collection){
            if (err){
                console.log('Error updating users collection: ' + err);
                res.send({'error':'An error has occurred'});
            }
            else {
                appendPlace(collection,user._id,place._id,place.name, {
                    success : function(result) {
                        console.log('finish creating follower');
                        res.send(result);
                    },
                    failed : function(err) {
                        console.log('crating follower failed: ' + err);
                        response.send({'error':'An error has occurred'});
                    }
                });
            }
        }
    );
};

