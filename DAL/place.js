var place1 = {
    name:"Las Vegas"
};

var place2 = {
    name:"New York"
};

var place3 = {
    name:"Hifa"
};

var test_data = [place1, place2, place3];

var common = require('common');

var collection_name = 'places';

var db = common.db_connect('tripbook', collection_name, test_data);

exports.isPlaceExist = function(id){
    return common.isExist(db, collection_name, {'_id':new BSON.ObjectID(id)});
};