var track = {
    "content": "I've started my trip in New York, then...",
    "photo": { },
    "user": { id: ObjectId("529872abb41da00000000002"), name: 'Elad Douenias' },
    "places": [],
    "comments": [],
    "likes": []
};

var test_data = [track];

var common = require('common');

var collection_name = 'tracks';

var db = common.db_connect('tripbook', collection_name, test_data);

function isCommentExist(track_id, comment_id){
    return common.isExist(db, collection_name, {'_id':new BSON.ObjectID(track_id), 'friends':{ $elemMatch : {"_id" : comment_id}}});
}

function getTrack(id){
    return common.getItem(db, collection_name, {'_id':new BSON.ObjectID(id)})
}

function isLiked(track_id, user_id){
    return common.isExist(db, collection_name, {"_id" :new BSON.ObjectID(track_id), "likes" :user_id });
}

exports.isTrackExist = function(id){
    return common.isExist(db, collection_name, {'_id':new BSON.ObjectID(id)});
};

exports.removeComment = function(track_id, comment_id){
    if (isCommentExist(track_id, comment_id)){
        return common.updateItem(db, collection_name, {'_id':new BSON.ObjectID(track_id)}, {$pull:{"comments":{"_id":comment_id}}});
    }
    return {status: true, data: getUser(user_id)};
};

exports.addComment = function(track_id, comment){
    return common.updateItem(db, collection_name, { '_id':new BSON.ObjectID(track_id)},{$push :{"comments" : comment}});
};

exports.removeLike = function(track_id, user_id){
    if(isLiked(track_id,user_id)){
        return common.updateItem(db, collection_name, { '_id':new BSON.ObjectID(track_id)}, {$pull :{"likes" : user_id}});
    }
    return {status: true, data: getTrack(track_id)};
};

exports.addLike = function(track_id, user_id){
    if(!isLiked(track_id,user_id)){
        return common.updateItem(db, collection_name, { '_id':new BSON.ObjectID(track_id)}, {$push :{"likes" : user_id}});
    }
    return {status: true, data: getTrack(track_id)};
};


function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    return require('mongodb').ObjectId(hexSeconds + "0000000000000000");
}

function daysAgoDate(daysAgo) {
    var date = new Date(); //now
    date.setDate(date.getDate() - daysAgo);
    return date;
}

exports.tracksForFeed = function(places, friends, daysAgo, callback) {
    db.collection(collection_name, function(err, collection){
            if (err) return null;

            collection.find(
                {
                    _id: { $gt: objectIdWithTimestamp(daysAgoDate(daysAgo)) },
                    $or: [
                        { user: { id: { $in: friends } } },
                        { places: { id: { $in: places } } }
                    ]
                },
                function(err, result) {
                    if (err) callback(err, null);
                    else callback(null, result.toArray());
                });

        }
    );
};

function tracksUsersIndex() {
    db.ensureIndex(collection_name, {user: 1}, {background:true});
}

exports.getUserTracks = function(userId) 
{
    tracksUsersIndex();
	db.collection(collection_name, function(err, collection)
	{
		collection.find({'user.id':parseInt(userId)}).toArray(function(err, tracks)
		{
			return tracks;
		});
	});	
};

exports.addTrack= function (track)
{
	db.collection('tracks', function(err, collection) 
	{
		collection.insert(track, {safe:true}, function(err, result) 
		{
			if (err)
			{
				return null;
			} 
			else
			{
				return result[0];
			}
		});
	});	
}

exports.getPlaceTracks = function(placeId) 
{
	db.collection('tracks', function(err, collection) 
	{
		collection.find({'places':{$elemMatch:{'id':placeId}}}).toArray(function(err, tracks) 
		{
			return tracks;
		});
	});
};

exports.addPlaceToTrack= function (place, trackId)
{	
	db.collection('tracks', function(err, collection) 
	{
		collection.update({'trackId':trackId}, {$push:{'places': place}}, function(err, result) {
			if (err)
			{				
				return null;
			} 
			else
			{	 
				return result[0];				
			}
		});
	});	
}

//not sure since many tracks can have the same place..
exports.getPlaceByName = function(placeName) 
{
	db.collection('tracks', function(err, collection) 
	{
		collection.findOne({'places':{$elemMatch:{'name':placeName}}}, function(err, track)
		{				
			var index = -1;
			for(var i = 0, len = track.places.length; i < len; i++) 
			{
				if (track.places[i].name === placeName) 
				{
					index = i;
					break;
				}
			}

			var place = track.places[index];
			return place;
		});
	});	
};
