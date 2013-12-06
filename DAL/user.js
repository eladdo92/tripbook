var config = require('./../configuration');

var db_name = config.database_name;
var collection_name = config.users_collection;
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

var mongo;

if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
    mongo = {
        "hostname" : config.database_host,
        "port" : config.database_port,
        "username" : "",
        "password" : "",
        "name" : "",
        "db" : db_name
    }
}

var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');

    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
};

var mongourl = generate_mongo_url(mongo);

var db = null;

var BSON = require('mongodb').BSONPure;

require('mongodb').connect(mongourl, function(err, conn){
    db = conn;
    if(!err) {
        console.log("Connected to '" + db_name + "' database");
        db.collection(collection_name, {strict:true}, function(err, collection) {
            if (err) {
                console.log("The '" + collection_name + "' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

var populateDB = function() {
    test_data.forEach(function(item){
        db.collection(collection_name, function(err, collection) {
            collection.insert(item, {safe:true}, function(err, result) {
                console.log("item1 result="+result);
                console.log("err="+err);
            });
        });
    });
};

var connect_collection = function(callback){
    require('mongodb').connect(mongourl, function(err, conn){
        db = conn;
        if(!err) {
            db.collection(collection_name, function(error, collection){
                if (error) callback(error, null);
                else {
                    callback(null, collection);
                }
            });
        }
    });
};

var update_callection = function(query, update, callback){
    connect_collection(function(error, collection){
        if (error) callback(error, null);
        else {
            collection.update(query, update, { safe : true }, function(error, result) {
                if (error) callback(error, null);
                else callback(null, result);
            });
        }
    });
};

var getItem = function(query, callback){
    connect_collection(function(error, collection){
        if (error) callback(error, null);
        else {
            collection.findOne(query, function(error, result) {
                if (error) callback(error, null);
                else callback(null, result);
            });
        }
    });
};

var get_user = function(id, callback){
    getItem({'_id':new BSON.ObjectID(id)}, callback);
};

exports.getUser = get_user;

var addFriend = function(user, friend, orig_callback, callback){
    update_callection({ '_id':new BSON.ObjectID(user._id)},  {$push :{'friends':{'_id':new BSON.ObjectID(friend._id), 'name':friend.name}}},
        function(error, result){
            if (error) orig_callback(error, null);
            else callback(result);
        });
};

var addPlace = function(user, place, orig_callback, callback){
    update_callection({ '_id':new BSON.ObjectID(user._id)},  {$push :{'places':{'_id':new BSON.ObjectID(place._id), 'name':place.name}}},
        function(error, result){
            if (error) callback(error, null);
            else callback(null, result);
        });
};

exports.getUsers = function(callback) {
    connect_collection(function(error, collection){
        if (error) callback(error, null);
        else {
            collection.find().toArray(function(error, result) {
                if (error) callback(error, null);
                else callback(null, result);
            });
        }
    });
};

exports.appendFriend = function(user, friend, callback){
    addFriend(friend, user, callback, function(result_friend){
        addFriend(user,friend, callback,function(result_user){
            get_user(user._id, function(error, user_info){
                user_info.status = result_user;
                if (!error) get_user(friend._id, function(error, friend_info){
                    friend_info.status = result_friend;
                    console.log({user: user_info, friend: friend_info});
                    if (!error) callback(null, {user: user_info, friend: friend_info});
                });
            });
        })
    });
};

exports.follow_place = function(user, place, callback){
    addPlace(user, place, callback, function(error, result){
        if (error) callback(error, null);
        else get_user(user._id, function(error, info){
            info.status = result;
            if (!error) callback(null, info);
        });
    });
};

function userNameIndex() {
    db.ensureIndex(collection_name, {name: 1}, {background:true}, function(err){
        if(err) console.log(err);
    });
}

exports.getUserByName = function(userName, callback){
    userNameIndex();
    db.collection(collection_name, function(err, collection)
    {
		collection.findOne({'name':userName}, function(err, user) 
		{
			if (err)
				callback(err, null);
			else			
				callback(null, user);
		});
	});	
};

exports.addUser = function (user, callback){
    connect_collection(function(error, collection){
        if (error) callback(error, null);
        else {
            collection.insert(user, {safe:true}, function(error, result) {
                if (error) callback(error, null);
                else callback(null, result);
            });
        }
    });
};

function userPlacesIndex(){
    db.ensureIndex(collection_name, {places: 1}, {background:true}, function(err){
        if(err) console.log(err);
    });
}

exports.usersThatFollow = function(placeId, callback){
    userPlacesIndex();
    connect_collection(function(err, collection)
    {
        if (err) callback(err, null);


        collection.find({'places': { '$elemMatch': { '_id': new BSON.ObjectID(placeId) } } }).toArray( function(err, result) {
            if(err) callback(err, null);
            else callback(null, result);
        });
    });
};
