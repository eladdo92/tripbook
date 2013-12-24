/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index');
};

exports.friends = function (req, res) {
    res.render('friends');
};

exports.places = function (req, res) {
    res.render('places');
};