exports.db_connect = function(db_name, collection_name, test_data){
    var mongo;

    if(process.env.VCAP_SERVICES){
        var env = JSON.parse(process.env.VCAP_SERVICES);
        mongo = env['mongodb-1.8'][0]['credentials'];
    }
    else{
        mongo = {
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
    };

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
};

function getCollection(db, collection_name){
    var response = {
        status : false,
        data : null
    };
    db.collection(collection_name, function(error, collection){
        if (error){
            console.log('Error connecting ' + collection_name + ' collection: ' + error);
            response.data = error;
        }
        response.data = collection;
        return response;
    })
}

exports.isExist = function(db, collection_name, query){
    collection = getCollection(db, collection_name);
    var exist = false;
    if (collection.status){
        collection.findOne(query, function(error, item) {
            if (error){
                console.log('Error connecting ' + collection_name + ' collection: ' + error);
            }
            exist = item? true : false;
        });
    }
    return exist;
};

exports.getItem = function(db, collection_name, query){
    collection = getCollection(db, collection_name);
    var item = null;
    if (collection.status){
        collection.findOne(query, function(error, result) {
            if (error){
                console.log('Error connecting ' + collection_name + ' collection: ' + error);
            }
            item = result;
        });
    }
    return item;
};

exports.updateItem = function(db, collection_name, query, update){
    collection = getCollection(db, collection_name);
    var response = collection;
    if (collection.status){
        collection = collection.data;
        collection.update(query, update, { safe : true }, function(error, result) {
            if (error) {
                console.log('Error updating '+ collection_name +' : ' + error);
                response.status = false;
                response.data = error;
            }
            else {
                response.data = result;
            }
        });
    }
    return response;
};