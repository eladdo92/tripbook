var dal = require('../DAL/user');

exports.followPlace = function(request, response){
    var user = request.body.user;
    var place = request.body.place;

    dal.follow_place(user, place, function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.createFriendship = function(request, response){
    var user = request.body.user;
    var friend = request.body.friend;

    dal.appendFriend(user, friend, function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.list = function(request, response){
    dal.getUsers(function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.SearchUser = function(req, res){
    	var url = require('url');
    	var url_parts = url.parse(req.url, true);
    	var query = url_parts.query;
    	var userName = query.userName;
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

exports.Register= function (req,res){
	var user = req.body;
	dal.addUser(user, function(err, result) 
	{
		if(result)
			res.send(result);	
		else
			res.send({'error':'An error has occurred'});
	});
};

exports.Feed = function(req, res){
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
