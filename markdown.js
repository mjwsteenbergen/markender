var Remarkable = require('remarkable');
var path = require('path');
var replaceStream = require('replacestream');
var fs = require('fs');
var ncp = require('ncp').ncp;
var express = require('express');
var app = express();
var runningWebsite = false;
var componentsPlugin = require('./components-plugin'); 

var markdown;

ConvertMDtoHTML();

function ConvertMDtoHTML()
{
    fs.readFile('./file.md', function (err, data) {
        if (err) {
            throw err; 
        }
        var md = new Remarkable({
            html: true
        });
        md.use(componentsPlugin);
        markdown = data.toString();
        RenderHTML(md.render(markdown));
    });
}

function RenderHTML(html) {
    
    var source = path.join(__dirname, "/template/");
    var destination = path.join(__dirname, "/build/");

    ncp(source, destination, function (err) {
        if (err) {
            return console.error(err);
        }

        var stream = fs.createReadStream(path.join(__dirname, "/build/template.html"))
        .pipe(replaceStream('{{content}}', html))
        .pipe(fs.createWriteStream(path.join(__dirname, "/build/index.html")));

        stream.on('finish', function(){
            SetUpWebserver();
            console.log("The file was saved!");            
        });
    });

    

}


function SetUpWebserver() {
    if(runningWebsite) {
        return;
    }
    runningWebsite = true;

    app.use(express.static(__dirname + '/build'))
    app.use(require('connect-livereload')({
        port: 35729
    }));

    app.get('/', function (req, res, next) {
    try {
        res.send(__dirname + '/build/index.html');
    } catch (e) {
        next(e)
    }
    })

    app.listen(process.env.PORT || 5000, function () {
        console.log('Listening on http://localhost:' + (process.env.PORT || 5000))
    })
    
}


