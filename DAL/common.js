function connect(db_name, collection_name, test_data){
    var mongo = require('mongodb');

    if(process.env.VCAP_SERVICES){
        var env = JSON.parse(process.env.VCAP_SERVICES);
        var mongo = env['mongodb-1.8'][0]['credentials'];
    }
    else{
        var mongo = {
            "hostname" : "localhost",
            "port" : 27017,
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
    }

    var mongourl = generate_mongo_url(mongo);

    var db = null;

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

    return db;
}