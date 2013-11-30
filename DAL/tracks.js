var db = require('common').connect('tripbook', 'tracks', []);

function isLiked(track_id, user_id){
    var track = db.users.findOne({"_id" : track_id, "likes" : user_id });
    return track? track : false;
}

function objectIdWithTimestamp(timestamp)
{
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    return mongo.ObjectId(hexSeconds + "0000000000000000");;
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

