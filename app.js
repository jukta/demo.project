var express = require('express');
var path = require('path');
var app = express();
var tahoe = require("sv-tahoe");
var svCore = require("../sv-aloha");
var comments = require("../sv-tahoe.social/lib/comments");
var post = require("../sv-tahoe.social/lib/post");
var bodyParser = require('body-parser');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

//var svWs = svCore.ws();
app.use(express.static(path.join(tahoe.config.destDir, "public")));
tahoe.express(app);

comments(tahoe, app);
post(tahoe, app);

app.get('/', function (req, res) {
    res.render('demo/base:base', {});
});

app.get('/social', function (req, res) {
    res.render('demo/social:social', {});
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

tahoe.compile(function(err) {
    if (err) return console.log(err.message + err.stack);

    app.set('port', 3000);
    var server = app.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + server.address().port);
    });
});

