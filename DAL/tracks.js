var mongo = require('mongodb');

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
        "db":"tracksdb"
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
        console.log("Connected to 'tracksdb' database");
        db.collection('tracks', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'tracks' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

var populateDB = function() {

};

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

exports.getUserTracks = function(req, res) 
{
	var userid = req.params.id;
	if (userid) 
	{
		db.collection('tracks', function(err, collection) 
		{
			collection.find({'userid':parseInt(userid)}).toArray(function(err, items) 
			{
				res.send(items);
			});
		});
	}
};

exports.addTrack= function (req,res)
{
	var track = req.body;	
	db.collection('tracks', function(err, collection) 
	{
		collection.insert(track, {safe:true}, function(err, result) {
			if (err)
			{
				res.send({'error':'An error has occurred'});
			} 
			else
			{
				res.send(result[0]);
			}
		});
	});	
}

exports.addPlaceToTrack= function (req,res)
{
	var place = req.body;
	var trackId = req.trackId;
	db.collection('tracks', function(err, collection) 
	{
		collection.update({'trackId':trackId}, {$push:{'places': place}}, function(err, result) {
			if (err)
			{
				res.send({'error':'An error has occurred'});
			} 
			else
			{	 	
				res.send(result[0]);
			}
		});
	});	
}

exports.getPlaceTracks = function(req, res) 
{
	var placeId = req.params.id;
	if (placeId) 
	{
		db.collection('tracks', function(err, collection) 
		{
			collection.find({'places':{$elemMatch:{'id':placeId}}}).toArray(function(err, items) 
			{
				res.send(items);
			});
		});
	}
};

//not sure since many tracks can have the same place..
exports.getPlaceByName = function(req, res) 
{
	var placeName = req.params.name;
	if (placeName) 
	{
		db.collection('tracks', function(err, collection) 
		{
			collection.findOne({'places':{$elemMatch:{'name':placeName}}}, function(err, track)//Foreach track, search if track contains placename 
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
				res.send(place);
			});
		});
	}
};

