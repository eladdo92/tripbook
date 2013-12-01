var dal = require('../DAL/user');

exports.followPlace = function(request, response){
    //get the data from the request object
    var user = request.body.user;
    var place = request.body.place;

    //validate data
    var exist = dal.isUserExist(user._id) && require('../DAL/place').isPlaceExist(place._id);

    if (!exist){
        response.send({'error': 'the user or the place does not exist'});
    }

    response.send(dal.addPlace(user,place));
};

exports.createFriendship = function(request, response){
    //get the data from the request object
    var user = request.body.user;
    var friend = request.body.friend;

    //validate data
    var exist = dal.isUserExist(user._id, user.name) && dal.isUserExist(friend._id, friend.name);

    if (!exist){
        response.send({'error': 'one or more of the users does not exist in database'});
    }

    //add the user to friend's friends list
    friendship = dal.addFriend(friend, user);

    if (!friendship.status){
        response.send({'error': friendship.data});
    }

    //add the new friend to user's friends list
    var friendship = dal.addFriend(user, friend);

    if (!friendship.status){
        dal.removeFriend(friend, user); //rollback friendship
        response.send({'error': friendship.data});
    }

    response.send(friendship);
};

exports.SearchUser = function(req, res) 
{
	var userName = req.params.userName;
	if (userName) 
	{
		dal.getUserByName(userName, function(err, result)
		{		
			if(result)
				res.send(result);	
			else
				res.send({'error':'An error has occurred'});
		});		
	}
};

exports.Register= function (req,res)
{
	var user = req.body;
	dal.addUser(user, function(err, result) 
	{
		if(result)
			res.send(result);	
		else
			res.send({'error':'An error has occurred'});
	});
}

exports.Feed = function(req, res) {
    var userid = req.params.id;
    var daysAgo = req.params.daysAgo || 1;

    var user = dal.getUser(userid);

    var places = user.places.toArray();
    var friends = user.friends.toArray();

    var placesIds = [];
    places.forEach(function(item){
        placesIds.push(item.id);
    });

    var friendsIds = [];
    friends.forEach(function(item){
        friendsIds.push(item.id);
    });

    dal.tracksForFeed(placesIds,friendsIds, daysAgo, function(err, result) {
        if(result)
            res.send(result);
        else
            res.send({'error':'An error has occurred'});
    });
};
