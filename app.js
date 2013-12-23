/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var place = require('./routes/place');
var track = require('./routes/track');
var http = require('http');
var path = require('path');
var config = require('./configuration');

var app = express();

app
    .use(function(req, res, next){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        next();
    })
    .options('*', function(req, res, next){
        //res.end();
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        next();
    });


// all environments
app.set('port', process.env.PORT || config.application_port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
//CREATE
app.post('/users/new', user.Register);
app.post('/tracks/new', track.PostTrack);
//READ
app.get('/users', user.SearchUser);
app.post('/login', user.IsUserExist);
app.get('/tracks/place/:id', track.getTracksTagedWithPlace);
app.get('/tracks/user/:id', track.getTracksUploadedByUser);
app.get('/place', place.SearchPlace);
app.get('/users/all', user.list);
app.get('/places/all', place.list);
app.get('/tracks/all', track.list);
app.get('/feed/:id', user.Feed);
app.get('/followers/:id', place.followers);

//UPDATE
app.put('/user/friend/new', user.createFriendship);
app.put('/user/place/follow', user.followPlace);
app.put('/tracks/comment/:id', track.comment);
app.put('/tracks/like/:id', track.like);
app.put('/track/place/tag/:id', track.TagTrackWithPlace);
//DELETE
app.delete('/tracks/comment/:id', track.removeComment);
app.delete('/tracks/like/:id', track.unlike);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
