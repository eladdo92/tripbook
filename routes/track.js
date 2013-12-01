var dal = require('../DAL/track');

exports.like = function(request, response) {
    var id = request.params.id;
    var user_id  = request.body;

    var exist = dal.isTrackExist(id);

    if (!exist){
        response.send({'error': 'the track does not exist'});
    }

    response.send(dal.addLike(id, user_id));
};

exports.unlike = function(request, response){
    var id = request.params.id;
    var user_id  = request.body;

    var exist = dal.isTrackExist(id);

    if (!exist){
        response.send({'error': 'the track does not exist'});
    }

    response.send(dal.removeLike(id, user_id));
};

exports.comment = function(request, response) {
    var id = request.params.id;
    var comment  = request.body;

    var exist = dal.isTrackExist(id);

    if (!exist){
        response.send({'error': 'the track does not exist'});
    }

    response.send(dal.addComment(id, comment));
};

exports.removeComment = function(request, response){
    var id = request.params.id;
    var comment_id  = request.body;

    var exist = dal.isTrackExist(id);

    if (!exist){
        response.send({'error': 'the track does not exist'});
    }

    response.send(dal.removeComment(id, comment_id));
};

exports.getTracksUploadedByUser = function(req, res) 
{
	var userId = req.params.id;
	if (userId) 
	{
		res.send(dal.getUserTracks(userId););
	}
};

exports.getTracksTagedWithPlace = function(req, res) 
{
	var placeId = req.params.id;
	if (placeId) 
	{
		res.send(dal.getPlaceTracks(placeId););
	}
};

exports.PostTrack = function (req,res)
{
	var track = req.body;
	var result = dal.addTrack(track)
	if(result)
		res.send(result);	
	else
		res.send({'error':'An error has occurred'});
}

exports.TagTrackWithPlace= function (req,res)
{
	var place = req.body;
	var trackId = req.trackId;
	var result = dal.addPlaceToTrack(place, trackId)
	if(result)
		res.send(result);	
	else
		res.send({'error':'An error has occurred'});	
}

exports.SearchPlace = function(req, res) 
{
	var placeName = req.params.name;
	if (placeName) 
	{
		res.send(dal.getPlaceByName(placeName););
	}
};
