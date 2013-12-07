var config = require('./../configuration');

var db_name = config.database_name;
var collection_name = config.places_collection;
var place1 = {
    name: "Las Vegas"
};

var place2 = {
    name: "New York"
};

var place3 = {
    name: "Hifa"
};

var test_data = [place1, place2, place3];

var mongo;

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-1.8'][0]['credentials'];
}
else {
    mongo = {
        "hostname": config.database_host,
        "port": config.database_port,
        "username": "",
        "password": "",
        "name": "",
        "db": db_name
    }
}

var generate_mongo_url = function (obj) {
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');

    if (obj.username && obj.password) {
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
};

var mongourl = generate_mongo_url(mongo);

var db = null;

require('mongodb').connect(mongourl, function (err, conn) {
    db = conn;
    if (!err) {
        console.log("Connected to '" + db_name + "' database");
        db.collection(collection_name, {strict: true}, function (err, collection) {
            if (err) {
                console.log("The '" + collection_name + "' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

var populateDB = function () {
    test_data.forEach(function (item) {
        db.collection(collection_name, function (err, collection) {
            collection.insert(item, {safe: true}, function (err, result) {
                console.log("item1 result=" + result);
                console.log("err=" + err);
            });
        });
    });
};

var connect_collection = function (callback) {
    require('mongodb').connect(mongourl, function (err, conn) {
        db = conn;
        if (!err) {
            db.collection(collection_name, function (error, collection) {
                if (error) callback(error, null);
                else {
                    callback(null, collection);
                }
            });
        }
    });
};

exports.getPlaces = function (callback) {
    connect_collection(function (error, collection) {
        if (error) callback(error, null);
        else {
            collection.find().toArray(function (error, result) {
                if (error) callback(error, null);
                else callback(null, result);
            });
        }
    });
};

exports.followers = function (placeId, callback) {
    require('./user').usersThatFollow(placeId, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
};

exports.getPlaceByName = function (placeName, callback) {
    db.collection(collection_name, function (err, collection) {
        collection.findOne({'name': placeName}, function (err, place) {
            if (err)
                callback(err, null);
            else
                callback(null, place);
        });
    });
};
