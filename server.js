var watch = require('watch');
// var reload = require('reload');
var express = require('express');
var app = express();
var http = require('http');
var fs = require("fs");
var path = require('path');
var argv = require('yargs').alias('l', 'location').argv;

app.use('/static', express.static(__dirname + '/dist/'));

myPath = path.dirname(argv.location).toString().slice(1)
app.use(express.static(myPath))
app.use(require('connect-livereload')({
    port: 35729
  }));

app.get('/', function (req, res, next) {
    try {
        res.sendFile(__dirname + '/dist/index.html');
    } catch (e) {
        next(e)
    }
})

var server = http.createServer(app)

server.listen(process.env.PORT || 3000, function () {
    console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})