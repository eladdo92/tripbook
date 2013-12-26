var dal = require('../DAL/place');

exports.list = function (request, response) {
    dal.getPlaces(function (error, result) {
        if (result)
            response.send(result);
        else
            response.send({'error': 'An error has occurred',
                'innerError': error});
    });
};

exports.followers = function (req, res) {
    var placeId = req.params.id;
    dal.followers(placeId, function (err, result) {
        if (result)
            res.send(result);
        else
            res.send({'error': 'An error has occurred'});
    });
};


exports.SearchPlace = function (req, res) {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var placeName = query.placeName;
    if (placeName) {
        dal.getPlaceByName(placeName, function (err, result) {
            if (result)
                res.send(result);
            else
                res.send({'error': 'An error has occurred'});
        });
    }
};

exports.AddPlace = function (req, res) {
    var Place = req.body;
    dal.addPlace(Place, function (err, result) {
        if (result)
            res.send(result);
        else
            res.send({'error': 'An error has occurred'});
    });
};

exports.AddTrackToPlace = function (req, res) {
    var track = req.body;
    var placeId = req.params.id;
    console.log('woot');
    console.log(track);
    console.log(placeId);

    dal.addTrackToPlace(track, placeId, function (err, result) {
        if (result)
            res.send(result);
        else
            res.send({'error': 'An error has occurred'});
    });
};
