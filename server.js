var watch = require('watch');
var reload = require('reload');
var express = require('express');
var app = express();
var http = require('http');
var fs = require("fs");

app.use(express.static(__dirname + '/dist/'));


app.get('/', function (req, res, next) {
    try {
        res.sendFile(__dirname + '/dist/index.html');
    } catch (e) {
        next(e)
    }
})

var server = http.createServer(app)
var reloadServer = reload(server, app);

server.listen(process.env.PORT || 3000, function () {
    console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})