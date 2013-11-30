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