var dal = require('../DAL/track');

exports.list = function(request, response){
    dal.getTracks(function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.like = function(request, response){

    var track_id = request.params.id;
    var user_id  = request.body.user_id;

    dal.addLike(track_id, user_id, function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.comment = function(request, response){

    var track_id = request.params.id;
    var comment  = request.body;
    dal.addComment(track_id, comment, function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.unlike = function(request, response){

    var track_id = request.params.id;
    var user_id  = request.body.user_id;

    dal.removeLike(track_id, user_id, function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.removeComment = function(request, response){

    var track_id = request.params.id;
    var comment_id  = request.body.comment_id;
    dal.removeComment(track_id, comment_id, function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.getTracksUploadedByUser = function(req, res){
	var userId = req.params.id;
	if (userId)
	{
		dal.getUserTracks(userId, function(err, result)
		{
			if(result)
				res.send(result);
			else
				res.send({'error':'An error has occurred'});
		});
	}
};

exports.getTracksTagedWithPlace = function(req, res){
	var url = require('url');
    	var url_parts = url.parse(req.url, true);
    	var query = url_parts.query;
    	var placeId = query.id;
	if (placeId)
	{
		dal.getPlaceTracks(placeId, function(err, result)
		{
			if(result)
				res.send(result);
			else
				res.send({'error':'An error has occurred'});
		});
	}
};

exports.PostTrack = function (req,res){
	var track = req.body;
	dal.addTrack(track, function(err, result)
	{
		if(result)
			res.send(result);
		else
			res.send({'error':'An error has occurred'});
	});
};

exports.TagTrackWithPlace= function (req,res){
	var place = req.body;
	var trackId = req.params.id;
	dal.addPlaceToTrack(place, trackId, function(err, result)
	{
		if(result)
			res.send(result);
		else
			res.send({'error':'An error has occurred'});
	});
};

exports.SearchPlace = function(req, res){
	var placeName = req.params.name;
	if (placeName)
	{
		dal.getPlaceByName(placeName, function(err, result)
		{
			if(result)
				res.send(result);
			else
				res.send({'error':'An error has occurred'});
		});
	}
};
