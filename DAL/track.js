var config = require('./../configuration');

var db_name = config.database_name;
var collection_name = config.tracks_collection;
var track = {
    "content": "I've started my trip in New York, then...",
    "user": { }
};

require('./user').getUsers(function(error, list){
    if (error) console.log(error);
    else if (list.length > 0) {
        track.user._id = list[0]._id;
        track.user.name = list[0].name;
    }
});
var test_data = [track];

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
                else callback(null, collection);
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

function objectIdWithTimestamp(timestamp){
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    return new BSON.ObjectID(hexSeconds + "0000000000000000");
}

function daysAgoDate(daysAgo){
    var date = new Date(); //now
    date.setDate(date.getDate() - daysAgo);
    return date;
}

function tracksUsersIndex(){
    db.ensureIndex(collection_name, {user: 1}, {background:true}, function(err){
        if(err) console.log(err);
    });
}

exports.tracksForFeed = function(placesIds, friendsIds, daysAgo, callback){
    connect_collection(function(err, collection) {
        if (err) {
            callback(err);
            return;
        }
        collection.find(
            {
                _id: { $gt: objectIdWithTimestamp(daysAgoDate(daysAgo)) },
                '$or': [
                    {'user._id': {'$in': friendsIds }},
                    {'places': { '$elemMatch': { '_id': {'$in': placesIds} } } }
                ]
            }).toArray(
            function(err, result) {
                if (err) callback(err, null);
                else callback(null, result);
            });
    });

};

exports.getUserTracks = function(userId, callback){
    tracksUsersIndex();
	db.collection(collection_name, function(err, collection)
	{
		collection.find({'user.id':parseInt(userId)}).toArray(function(err, tracks)
		{
			if (err)
				callback(err, null);
			else			
				callback(null, tracks);
		});
	});	
};

exports.addTrack= function (track, callback){
	db.collection('tracks', function(err, collection) 
	{
		collection.insert(track, {safe:true}, function(err, result) 
		{
			if (err)
				callback(err, null);
			else
				callback(null, result[0]);
		});
	});	
};

exports.getPlaceTracks = function(placeId, callback){
	db.collection('tracks', function(err, collection) 
	{
		collection.find({'places':{$elemMatch:{'id':placeId}}}).toArray(function(err, tracks) 
		{
			if (err)
				callback(err, null);
			else
				callback(null, tracks);
		});
	});
};

exports.addPlaceToTrack= function (place, trackId, callback){
	db.collection('tracks', function(err, collection) 
	{
		collection.update({'trackId':trackId}, {$push:{'places': place}}, function(err, result) 
		{
			if (err)
				callback(err, null);
			else
				callback(null, result[0]);
		});
	});	
};

exports.getTracks = function(callback) {
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

exports.addLike = function(track_id, user_id, callback){
    update_callection({ '_id':new BSON.ObjectID(track_id)},  {$push :{"likes" :new BSON.ObjectID(user_id)}},
        function(error, result){
            if (error) callback(error, null);
            else callback(null, result);
        });
};

exports.addComment = function(track_id, comment, callback){
    comment._id = new BSON.ObjectID();
    update_callection({ '_id':new BSON.ObjectID(track_id)},  {$push :{"comments" : comment}},
        function(error, result){
            if (error) callback(error, null);
            else callback(null, result);
        });
};

exports.removeLike = function(track_id, user_id, callback){
    update_callection({ '_id':new BSON.ObjectID(track_id)}, {$pull :{"likes" :new BSON.ObjectID(user_id)}},
        function(error, result){
            if (error) callback(error, null);
            else callback(null, result);
        });
};

exports.removeComment = function(track_id, comment_id, callback){
    update_callection({ '_id':new BSON.ObjectID(track_id)},  {$pull:{"comments":{"_id":new BSON.ObjectID(comment_id)}}},
        function(error, result){
            if (error) callback(error, null);
            else callback(null, result);
        });
};
