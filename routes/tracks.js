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
    var track = {
        "content": "I've started my trip in New York, then...",
        "photo": { },
        "user": { id: ObjectId("529872abb41da00000000002"), name: 'Elad Douenias' },
        "places": [],
        "comments": [],
        "likes": []
    };

    db.collection('tracks', function(err, collection) {
        collection.insert(track, {safe:true}, function(err, result) {
            err ?
                console.log("err = " + err) :
                console.log("track result = " + result);

        });
    });
};

function isLiked(track_id, user_id){
    var track = db.users.findOne({"_id" : track_id, "likes" : user_id });
    return track? track : false;
}

function errorResponse(msg, res){
    console.log('Error updating tracks collection: ' + msg);
    res.send({'error':'An error has occurred'});
}

exports.like = function(req, res) {
    var id = req.params.id;
    var user_id  = req.body;
    if (!isLiked(id, user_id)){
        db.collection('tracks', function(err, collection){
                if (err){
                    errorResponse(err, res);
                }
                else {
                    collection.update({"_id" : id}, {$push :{"likes" : user_id}},
                        { safe : true },
                        function(err, result) {
                            if (err) {
                                errorResponse(err, res);
                            }
                            res.send(result);
                        });
                }
            }
        );
    }
};

exports.unlike = function(req, res){
    var id = req.params.id;
    var user_id  = req.body;
    if(isLiked(id,user_id)){
        db.collection('tracks', function(err, collection){
                if (err){
                    errorResponse(err, res);
                }
                else {
                    collection.update({"_id" : id}, {$pull :{"likes" : user_id}},
                        { safe : true },
                        function(err, result) {
                            if (err) {
                                errorResponse(err, res);
                            }
                            res.send(result);
                        });
                }
            }
        );
    }
};

exports.comment = function(req, res) {
    var id = req.params.id;
    var comment  = req.body;
    db.collection('tracks', function(err, collection){
            if (err){
                errorResponse(err, res);
            }
            else {
                collection.update({"_id" : id}, {$push :{"comments" : comment}},
                    { safe : true },
                    function(err, result) {
                        if (err) {
                            errorResponse(err, res);
                        }
                        res.send(result);
                    });
            }
        }
    );
};

exports.removeComment = function(req, res){
    var id = req.params.id;
    var comment_id  = req.body;
    db.collection('tracks', function(err, collection){
            if (err){
                errorResponse(err, res);
            }
            else {
                collection.update({"_id" : id}, {$pull :{"comments" : { "_id" : comment_id }}},
                    { safe : true },
                    function(err, result) {
                        if (err) {
                            errorResponse(err, res);
                        }
                        res.send(result);
                    });
            }
        }
    );
};

exports.feed = function(req, res){
    var id = req.params.id;
    var tracksDal = require('../DAL/tracks');
    var usersDal = require('../DAL/users');
    var places = usersDal.getUserPlaces(id);
    var friends = usersDal.getUserFriends(id);


    res.send('');

}