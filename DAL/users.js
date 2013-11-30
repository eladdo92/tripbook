exports.forExample = function() {
    console.log('from DAL/users');
};

exports.getUserPlaces = function(id) {
    //TODO: implement
    return ['id1', 'id2'];
};

exports.getUserFriends = function(id) {
    //TODO: implement
    return ['id1', 'id2'];
};

exports.getUserByName = function(req, res) 
{
	var userName = req.params.userName;
	if (userName) 
	{
		db.collection('users', function(err, collection) 
		{
			collection.findOne({'name':userName}).toArray(function(err, items) 
			{
				res.send(items);
			});
		});
	}
};

exports.addUser = function (req,res)
{
	var user = req.body;	
	db.collection('users', function(err, collection) 
	{
		collection.insert(user, {safe:true}, function(err, result) {
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

