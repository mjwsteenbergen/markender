var watch = require('watch');
// var reload = require('reload');
var express = require('express');
var app = express();
var http = require('http');
var fs = require("fs");
var argv = require('yargs').alias('l', 'location').argv;

app.use('/static', express.static(__dirname + '/dist/'));
console.log(process.cwd())
app.use(express.static(process.cwd()))
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