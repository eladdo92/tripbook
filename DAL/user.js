var user1 = {
    name:"Ben Hodeda",
    email:"benhodeda@gmail.com",
    password:"123456789"
};

var user2 = {
    name:"Elad Douenias",
    email:"eladdo92@gmail.com",
    password:"123456789"
};

var user3 = {
    name:"Oded Cagan",
    email:"odedcagan@gmail.com",
    password:"123456789"
};

var test_data = [user1, user2, user3];

var common = require('common');

var collection_name = 'users';

var db = common.db_connect('tripbook', collection_name, test_data);

function getUser(id){
    return common.getItem(db, collection_name, {'_id':new BSON.ObjectID(id)})
}

function hasPlace(user_id, place_id){
    return common.isExist(db, collection_name, {"_id" : user_id, "places" : { $elemMatch : {"_id" : place_id}}});
}

function isFriendExist(user_id, friend_id){
    return common.isExist(db, collection_name, {'_id':new BSON.ObjectID(user_id), 'friends':{ $elemMatch : {"_id" : friend_id}}});
}

exports.isUserExist = function(user_id, name){
    return common.isExist(db, collection_name, {'_id':new BSON.ObjectID(user_id), 'name':name});
};

exports.isUserExist = function(user_id){
    return common.isExist(db, collection_name, {'_id':new BSON.ObjectID(user_id)});
};

exports.addFriend = function(user, friend){

    if(isFriendExist(user._id, friend._id)){
        return { status: true, data:  getUser(user._id)};
    }

    return common.updateItem(db, collection_name, { '_id':new BSON.ObjectID(user._id)},
        {$push :{'friends':{'_id':new BSON.ObjectID(friend._id), 'name':friend.name}}});
};

exports.removeFriend = function(user_id, friend_id){
    if (isFriendExist(user_id, friend_id)){
        return common.updateItem(db, collection_name, {'_id':new BSON.ObjectID(user_id)}, {$pull:{"friends":{"_id":friend_id}}});
    }
    return {status: true, data: getUser(user_id)};
};

exports.addPlace = function(user, place){
    if(hasPlace(user._id, place._id)){
        return { status: true, data:  getUser(user._id)};
    }
    return common.updateItem(db, collection_name, {'_id':new BSON.ObjectID(user._id)},
        {$push:{'places':{'_id':new BSON.ObjectID(place._id), 'name':place.name}}});
};

exports.getUserByName = function(userName) {
	db.collection('users', function(err, collection) 
	{
		collection.findOne({'name':userName}).toArray(function(err, user) 
		{
			return user;
		});
	});	
};

exports.addUser= function (user)
{	
	db.collection('users', function(err, collection) 
	{
		collection.insert(user, {safe:true}, function(err, result) {
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
};
