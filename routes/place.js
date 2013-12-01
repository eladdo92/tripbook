var dal = require('../DAL/place')

exports.followers = function(req, res) {
    var placeId = req.params.id;
    dal.followers(placeId, function(err, result) {
        if(result)
            res.send(result);
        else
            res.send({'error':'An error has occurred'});
    });
}