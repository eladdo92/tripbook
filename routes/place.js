var dal = require('../DAL/place');

exports.list = function(request, response){
    dal.getPlaces(function(error, result){
        if(result)
            response.send(result);
        else
            response.send({'error':'An error has occurred',
                'innerError':error});
    });
};

exports.followers = function(req, res) {
    var placeId = req.params.id;
    dal.followers(placeId, function(err, result) {
        if(result)
            res.send(result);
        else
            res.send({'error':'An error has occurred'});
    });
};