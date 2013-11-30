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

    return mongo.ObjectId(hexSeconds + "0000000000000000");
}

function daysAgoDate(daysAgo) {
    var date = new Date(); //now
    date.setDate(date.getDate() - daysAgo);
    return date;
}

function errorResponse(msg, res){
    console.log('Error updating tracks collection: ' + msg);
    res.send({'error':'An error has occurred'});
}

exports.tracksForFeed = function(places, friends, daysAgo) {
    db.collection('tracks', function(err, collection){
            if (err){
                errorResponse(err, res);
            }
            else {
                collection.find(
                    {
                        $or: [
                            {
                                user: {
                                    id: { $in: friends }
                                }
                            },
                            {
                                places: {
                                    id: { $in: places }
                                }
                            }
                        ],
                        $and: {
                            _id: {
                                $gt: objectIdWithTimestamp(daysAgoDate(daysAgo))
                            }
                        }
                    },
                    function(err, result) {
                        if (err) {
                            errorResponse(err, res);
                        }
                        return result;
                    });
            }
        }
    );
};

